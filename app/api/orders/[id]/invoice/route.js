import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import { generateInvoicePDF } from '@/lib/pdfGenerator'
import { ensureInvoiceForOrder } from '@/services/invoiceService'
import { validateObjectId } from '@/lib/validation/mongodb'
import { errorResponse, handleApiError, successResponse } from '@/lib/response'

function buildOrderQuery(identifier) {
  const idError = validateObjectId(identifier, 'order id')
  return idError ? { orderId: identifier } : { _id: identifier }
}

export async function GET(request, { params }) {
  const { id } = await params
  return handleInvoiceRequest(id, 'download', request)
}

export async function POST(request, { params }) {
  const { id } = await params
  return handleInvoiceRequest(id, 'generate', request)
}

async function handleInvoiceRequest(orderId, action, request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return errorResponse('Unauthorized', 401)

    await connectDB()
    const order = await Order.findOne(buildOrderQuery(orderId)).lean()
    if (!order) return errorResponse('Order not found', 404)

    // Security: Only admin or the customer who placed the order
    if (session.user.role !== 'admin' && order.userId?.toString() !== session.user.id) {
      return errorResponse('Access denied', 403)
    }

    let invoice = null

    // If generating new or missing, create the invoice record
    if (action === 'generate') {
      if (session.user.role !== 'admin') {
        return errorResponse('Only admins can generate new invoices', 403)
      }

      invoice = await ensureInvoiceForOrder(order, session.user.id, true)
    } else {
      invoice = await ensureInvoiceForOrder(order, session.user.id, false)
    }

    // Attach non-db strictly needed populated data for PDF (like customer name)
    const pdfData = {
      ...invoice,
      trackingOrderId: order.orderId,
      customerDetails: {
        customerName: order.customerInfo?.name || 'Customer',
        phone: order.customerInfo?.phone || '',
        email: order.customerInfo?.email || '',
        deliveryAddress: [
          order.customerInfo?.address,
          order.customerInfo?.city,
          order.customerInfo?.state,
          order.customerInfo?.pincode ? `- ${order.customerInfo.pincode}` : null,
        ].filter(Boolean).join(', '),
      }
    }

    if (action === 'generate') {
      return successResponse({
        message: `Invoice ${invoice.invoiceId} generated successfully`,
        invoiceId: invoice.invoiceId,
        orderId: order.orderId,
        orderMongoId: String(order._id),
      })
    }

    const pdfBuffer = await generateInvoicePDF(pdfData)

    if (action === 'download') {
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="invoice_${order.orderId || order._id}.pdf"`,
        },
      })
    }

    return errorResponse('Unsupported invoice action', 400)

  } catch (err) {
    return handleApiError('orders.id.invoice', err)
  }
}
