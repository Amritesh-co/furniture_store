import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import { ensureInvoiceForOrder, sendOrderInvoiceEmail } from '@/services/invoiceService'
import { validateObjectId } from '@/lib/validation/mongodb'
import { errorResponse, handleApiError, successResponse } from '@/lib/response'

function buildOrderQuery(identifier) {
  const idError = validateObjectId(identifier, 'order id')
  return idError ? { orderId: identifier } : { _id: identifier }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return errorResponse('Unauthorized', 401)
    }

    await connectDB()
    const { id } = await params
    const order = await Order.findOne(buildOrderQuery(id)).lean()
    if (!order) return errorResponse('Order not found', 404)

    const invoice = await ensureInvoiceForOrder(order, session.user.id, false)

    if (!order.customerInfo?.email) {
      return errorResponse('Customer email is missing for this order', 400)
    }

    const emailResult = await sendOrderInvoiceEmail(order, invoice)

    if (emailResult.success) {
      return successResponse({
        message: `Invoice email sent to ${order.customerInfo.email}`,
        messageId: emailResult.messageId,
      })
    }

    console.error('Invoice email send failed', { reason: emailResult.error })
    return errorResponse('Failed to send invoice email', 500)

  } catch (err) {
    return handleApiError('orders.id.emailInvoice.post', err)
  }
}
