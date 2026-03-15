import PDFDocument from 'pdfkit'
import { BUSINESS_INFO } from '@/lib/businessConfig'
import { getBusinessInfo } from '@/lib/settingsService'

export const generateInvoicePDF = async (invoiceData) => {
  return new Promise((resolve, reject) => {
    try {
      const businessInfoPromise = getBusinessInfo().catch(() => BUSINESS_INFO)
      const doc = new PDFDocument({ margin: 50, size: 'A4' })
      let buffers = []
      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => resolve(Buffer.concat(buffers)))
      doc.on('error', reject)

      businessInfoPromise.then((businessInfo) => {
        generateHeader(doc, businessInfo)
        generateCustomerInformation(doc, invoiceData)
        generateInvoiceTable(doc, invoiceData)
        generateFooter(doc, businessInfo)
        doc.end()
      }).catch(reject)
    } catch (error) {
      reject(error)
    }
  })
}

function generateHeader(doc, businessInfo) {
  doc
    .fillColor('#7A1E2C')
    .fontSize(20)
    .text(businessInfo.brandName, 50, 50)
    .fillColor('#444444')
    .fontSize(10)
    .text(businessInfo.displayName, 200, 50, { align: 'right' })
    .text(businessInfo.addressLine1, 200, 65, { align: 'right' })
    .text(businessInfo.addressLine2, 200, 80, { align: 'right' })
    .text(`Phone/WhatsApp: ${businessInfo.phone}`, 200, 95, { align: 'right' })
    .text(`Email: ${businessInfo.email}`, 200, 110, { align: 'right' })
    .moveDown()
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor('#444444').fontSize(20).text('INVOICE', 50, 160)
  generateHr(doc, 185)

  const customerInformationTop = 200
  const parsedDate = invoice?.invoiceDate ? new Date(invoice.invoiceDate) : new Date()
  const dateStr = Number.isNaN(parsedDate.getTime()) ? new Date().toLocaleDateString('en-IN') : parsedDate.toLocaleDateString('en-IN')
  const fallbackOrderId = invoice?.orderId ? String(invoice.orderId).slice(-8).toUpperCase() : 'N/A'
  const displayOrderId = invoice?.trackingOrderId || fallbackOrderId

  doc
    .fontSize(10)
    .text('Invoice Number:', 50, customerInformationTop)
    .font('Helvetica-Bold')
    .text(invoice.invoiceId, 150, customerInformationTop)
    .font('Helvetica')
    .text('Invoice Date:', 50, customerInformationTop + 15)
    .text(dateStr, 150, customerInformationTop + 15)
    .text('Order ID:', 50, customerInformationTop + 30)
    .text(displayOrderId, 150, customerInformationTop + 30)
    .text('Payment Status:', 50, customerInformationTop + 45)
    .text(invoice.paymentStatus, 150, customerInformationTop + 45)

    .text('Billed To:', 300, customerInformationTop)
    .font('Helvetica-Bold')
    .text(invoice.customerDetails?.customerName || 'Customer', 300, customerInformationTop + 15)
    .font('Helvetica')
    .text(invoice.customerDetails?.phone || '', 300, customerInformationTop + 30)
    .text(invoice.customerDetails?.deliveryAddress || '', 300, customerInformationTop + 45, { width: 250 })
    .moveDown()

  generateHr(doc, 275)
}

function generateInvoiceTable(doc, invoice) {
  let i
  const invoiceTableTop = 330
  const formatCur = (v) => {
    const amount = Number(v || 0)
    return 'Rs. ' + amount.toLocaleString('en-IN')
  }
  const items = Array.isArray(invoice?.items) ? invoice.items : []
  const pricing = invoice?.pricing || {}

  doc.font('Helvetica-Bold')
  generateTableRow(doc, invoiceTableTop, 'Item', 'Warranty', 'Unit Cost', 'Quantity', 'Line Total')
  generateHr(doc, invoiceTableTop + 20)
  doc.font('Helvetica')

  let position = 0
  for (i = 0; i < items.length; i++) {
    const item = items[i]
    const productName = typeof item?.productName === 'string' && item.productName.trim() ? item.productName : 'Product'
    const quantity = Number(item?.quantity || 0)
    const unitPrice = Number(item?.unitPrice || 0)
    const subtotal = Number(item?.subtotal || (unitPrice * quantity))
    position = invoiceTableTop + (i + 1) * 30
    generateTableRow(
      doc,
      position,
      productName.slice(0, 25),
      item.warranty?.warrantyPeriod || 'N/A',
      formatCur(unitPrice),
      quantity,
      formatCur(subtotal)
    )
    generateHr(doc, position + 20)
  }

  const subtotalsPosition = position + 40
  doc.font('Helvetica-Bold')
  generateTableRow(doc, subtotalsPosition, '', '', 'Subtotal', '', formatCur(pricing.subtotal))
  
  const deliveryPosition = subtotalsPosition + 20
  doc.font('Helvetica')
  generateTableRow(doc, deliveryPosition, '', '', 'Delivery', '', Number(pricing.deliveryCharge || 0) === 0 ? 'Free' : formatCur(pricing.deliveryCharge))
  
  const totalPosition = deliveryPosition + 25
  doc.font('Helvetica-Bold').fontSize(12)
  generateTableRow(doc, totalPosition, '', '', 'Total Amount', '', formatCur(pricing.totalAmount))
  doc.fontSize(10)
}

function generateFooter(doc, businessInfo) {
  doc
    .fontSize(10)
    .fillColor('#888888')
    .text('Warranty terms apply as per product policy. Furniture once sold will not be returned unless manufacturing defect is confirmed.', 50, 700, { align: 'center', width: 500 })
    .text(`Thank you for choosing ${businessInfo.displayName}.`, 50, 740, { align: 'center', width: 500 })
}

function generateTableRow(doc, y, item, description, unitCost, quantity, lineTotal) {
  doc
    .fontSize(10)
    .text(item, 50, y, { width: 150 })
    .text(description, 200, y, { width: 100 })
    .text(unitCost, 300, y, { width: 90, align: 'right' })
    .text(quantity, 400, y, { width: 40, align: 'right' })
    .text(lineTotal, 450, y, { width: 90, align: 'right' })
}

function generateHr(doc, y) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke()
}
