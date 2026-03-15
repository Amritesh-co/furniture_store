import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import { requireAdminSession, requireUserSession } from '@/lib/auth/session'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { validateOrderPayload } from '@/lib/validation/order'
import { createOrderWithInventoryAdjustments } from '@/services/orderService'
import { autoGenerateAndSendInvoiceForOrder } from '@/services/invoiceService'

export async function GET() {
  try {
    const { session, response } = await requireAdminSession()
    if (response) {
      // Preserve existing contract for this endpoint.
      if (!session) return errorResponse('Forbidden', 403)
      return response
    }

    await connectDB()
    const orders = await Order.find().sort({ createdAt: -1 }).lean()
    return successResponse(JSON.parse(JSON.stringify(orders)))
  } catch (err) {
    return handleApiError('orders.get', err)
  }
}


export async function POST(request) {
  try {
    const { session, response } = await requireUserSession()
    if (response) return response

    await connectDB()
    const body = await request.json()
    const validationError = validateOrderPayload(body)
    if (validationError) return errorResponse(validationError, 400)

    const order = await createOrderWithInventoryAdjustments(body, session.user.id)
    await autoGenerateAndSendInvoiceForOrder(order, session.user.id)

    return successResponse(JSON.parse(JSON.stringify(order)), 201)
  } catch (err) {
    return handleApiError('orders.post', err)
  }
}
