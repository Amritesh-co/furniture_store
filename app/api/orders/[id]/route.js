import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import { requireAdminSession, requireUserSession } from '@/lib/auth/session'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { logInfo, logError } from '@/lib/api/logger'
import { validateObjectId } from '@/lib/validation/mongodb'

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

function buildOrderQuery(identifier) {
  const idError = validateObjectId(identifier, 'order id')
  return idError ? { orderId: identifier } : { _id: identifier }
}

export async function PUT(request, { params }) {
  try {
    const { response } = await requireAdminSession()
    if (response) return response

    await connectDB()
    const { id } = await params
    const orderQuery = buildOrderQuery(id)

    const { status } = await request.json()
    if (!VALID_STATUSES.includes(status)) {
      return errorResponse('Invalid status', 400)
    }
    
    const order = await Order.findOneAndUpdate(orderQuery, { status }, { new: true })
    if (!order) return errorResponse('Not found', 404)

    // Auto-generate invoice and send email if status progresses past pending and hasn't yet generated
    if (['processing', 'shipped', 'delivered'].includes(status)) {
      try {
        const origin = request.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000'
        
        // Setup internal request to trigger the invoice pipeline silently
        const invoiceUrl = new URL(`/api/orders/${id}/invoice`, origin)
        const generateRes = await fetch(invoiceUrl, {
          method: 'POST',
          headers: { cookie: request.headers.get('cookie') }
        })

        if (generateRes.ok) {
          const emailUrl = new URL(`/api/orders/${id}/email-invoice`, origin)
          await fetch(emailUrl, {
            method: 'POST',
            headers: { cookie: request.headers.get('cookie') }
          })
          logInfo('order.invoice.pipeline.triggered', { orderId: id, status })
        }
      } catch (triggerError) {
        logError('order.invoice.pipeline.failed', triggerError, { orderId: id, status })
      }
    }

    logInfo('order.status.updated', { orderMongoId: String(order._id), orderId: order.orderId, status })
    return successResponse(JSON.parse(JSON.stringify(order)))
  } catch (err) {
    return handleApiError('orders.id.put', err)
  }
}

export async function GET(request, { params }) {
  try {
    const { session, response } = await requireUserSession()
    if (response) return response

    await connectDB()
    const { id } = await params
    const orderQuery = buildOrderQuery(id)

    const order = await Order.findOne(orderQuery).lean()
    if (!order) return errorResponse('Not found', 404)

    if (session.user.role !== 'admin' && order.userId?.toString() !== session.user.id) {
      return errorResponse('Access denied', 403)
    }

    return successResponse(JSON.parse(JSON.stringify(order)))
  } catch (err) {
    return handleApiError('orders.id.get', err)
  }
}
