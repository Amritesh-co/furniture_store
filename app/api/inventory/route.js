import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { requireAdminSession } from '@/lib/auth/session'
import { successResponse, handleApiError } from '@/lib/api/response'

export async function GET() {
  try {
    const { response } = await requireAdminSession()
    if (response) return response

    await connectDB()
    const products = await Product.find().sort({ name: 1 }).lean()
    return successResponse(JSON.parse(JSON.stringify(products)))
  } catch (err) {
    return handleApiError('inventory.get', err)
  }
}
