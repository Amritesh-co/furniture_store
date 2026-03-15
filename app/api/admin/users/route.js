import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { requireAdminSession } from '@/lib/auth/session'
import { successResponse, handleApiError } from '@/lib/api/response'

export async function GET() {
  try {
    const { response } = await requireAdminSession()
    if (response) return response

    await connectDB()
    const users = await User.find({}, '-password').sort({ createdAt: -1 }).lean()
    return successResponse(JSON.parse(JSON.stringify(users)))
  } catch (err) {
    return handleApiError('admin.users.get', err)
  }
}
