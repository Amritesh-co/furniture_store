import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { errorResponse, handleApiError, successResponse } from '@/lib/response'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return errorResponse('Unauthorized', 401)

    await connectDB()
    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean()
      
    return successResponse(JSON.parse(JSON.stringify(orders)))
  } catch (err) {
    return handleApiError('orders.me.get', err)
  }
}
