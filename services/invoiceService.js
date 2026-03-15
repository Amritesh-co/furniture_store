import Invoice from '@/lib/models/Invoice'
import Product from '@/lib/models/Product'
import mongoose from 'mongoose'
import { generateInvoicePDF } from '@/lib/pdfGenerator'
import { sendInvoiceEmail } from '@/lib/emailSender'
import { logError, logInfo } from '@/lib/api/logger'

function buildCustomerDetails(order) {
  return {
    customerName: order?.customerInfo?.name || 'Customer',
    phone: order?.customerInfo?.phone || '',
    email: order?.customerInfo?.email || '',
    deliveryAddress: [
      order?.customerInfo?.address,
      order?.customerInfo?.city,
      order?.customerInfo?.state,
      order?.customerInfo?.pincode ? `- ${order.customerInfo.pincode}` : null,
    ].filter(Boolean).join(', '),
  }
}

function buildInvoiceId(order) {
  const seed = String(order?.orderId || order?._id || '').slice(-6).toUpperCase() || 'ORDER'
  const ts = Date.now().toString().slice(-6)
  return `INV-${ts}-${seed}`
}

async function buildProductsWithWarranty(order) {
  const orderProducts = Array.isArray(order?.products) ? order.products : []

  return Promise.all(
    orderProducts.map(async (p) => {
      let product = null

      try {
        if (p?.productId) {
          product = await Product.findById(p.productId).lean()
        }
      } catch {
        product = null
      }

      const quantity = Number(p?.quantity || 0)
      const unitPrice = Number(p?.price || 0)

      return {
        productId: p?.productId || null,
        productName: p?.name || 'Product',
        quantity,
        unitPrice,
        subtotal: unitPrice * quantity,
        warranty: {
          warrantyPeriod: product?.warranty?.warrantyPeriod || 'None',
          guaranteePeriod: product?.warranty?.guaranteePeriod || 'None',
        },
      }
    })
  )
}

function buildPdfPayload(order, invoice) {
  return {
    ...invoice,
    trackingOrderId: order?.orderId,
    customerDetails: buildCustomerDetails(order),
  }
}

export async function ensureInvoiceForOrder(order, generatedBy, replaceExisting = false) {
  const existing = await Invoice.findOne({ orderId: order._id }).lean()
  if (existing && !replaceExisting) {
    return existing
  }

  const items = await buildProductsWithWarranty(order)
  const invoiceData = {
    invoiceId: existing?.invoiceId || buildInvoiceId(order),
    orderId: order._id,
    customerId: order.userId || null,
    items,
    pricing: {
      subtotal: Number(order?.subtotal || 0),
      deliveryCharge: Number(order?.shipping || 0),
      totalAmount: Number(order?.total || 0),
    },
    paymentStatus: order?.paymentMethod === 'COD' && order?.status !== 'delivered' ? 'Pending' : 'Paid',
    generatedBy: generatedBy || order.userId || null,
  }

  if (existing) {
    return Invoice.findOneAndUpdate({ orderId: order._id }, invoiceData, { new: true }).lean()
  }

  const created = await Invoice.create(invoiceData)
  return created.toObject()
}

export async function sendOrderInvoiceEmail(order, invoice) {
  const customerEmail = order?.customerInfo?.email
  if (!customerEmail) {
    return { success: false, error: 'Customer email is missing' }
  }

  const pdfPayload = buildPdfPayload(order, invoice)
  const pdfBuffer = await generateInvoicePDF(pdfPayload)

  return sendInvoiceEmail({
    customerEmail,
    customerName: order?.customerInfo?.name || 'Customer',
    orderId: order?.orderId || String(order?._id || ''),
    invoiceId: invoice?.invoiceId,
    totalAmount: invoice?.pricing?.totalAmount || order?.total || 0,
    pdfBuffer,
  })
}

export async function autoGenerateAndSendInvoiceForOrder(order, generatedBy) {
  const orderMongoId = String(order?._id || '')
  const trackingOrderId = order?.orderId || orderMongoId

  if (!mongoose.Types.ObjectId.isValid(orderMongoId)) {
    logInfo('invoice.auto.skipped_invalid_order_id', {
      orderMongoId,
      orderId: trackingOrderId,
    })

    return {
      success: false,
      invoiceId: null,
      error: 'Order identifier is not a valid ObjectId',
      skipped: true,
    }
  }

  try {
    const invoice = await ensureInvoiceForOrder(order, generatedBy, false)
    const emailResult = await sendOrderInvoiceEmail(order, invoice)

    if (emailResult.success) {
      logInfo('invoice.auto.sent', {
        orderMongoId,
        orderId: trackingOrderId,
        invoiceId: invoice?.invoiceId,
        messageId: emailResult.messageId,
      })
    } else {
      logError('invoice.auto.send_failed', new Error(emailResult.error || 'Failed to send invoice email'), {
        orderMongoId,
        orderId: trackingOrderId,
        invoiceId: invoice?.invoiceId,
      })
    }

    return { success: emailResult.success, invoiceId: invoice?.invoiceId, error: emailResult.error || null }
  } catch (error) {
    logError('invoice.auto.generate_or_send_failed', error, { orderMongoId, orderId: trackingOrderId })
    return { success: false, invoiceId: null, error: error?.message || 'Unknown invoice automation error' }
  }
}
