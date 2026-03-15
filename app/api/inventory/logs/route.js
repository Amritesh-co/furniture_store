import connectDB from '@/lib/mongodb'
import InventoryLog from '@/lib/models/InventoryLog'
import { requireAdminSession } from '@/lib/auth/session'
import { successResponse, handleApiError } from '@/lib/api/response'

export async function GET() {
  try {
    const { response } = await requireAdminSession()
    if (response) return response

    await connectDB()
    const logs = await InventoryLog.find().sort({ createdAt: -1 }).limit(100).lean()
    return successResponse(JSON.parse(JSON.stringify(logs)))
  } catch (err) {
    return handleApiError('inventory.logs.get', err)
  }
}
