import connectDB from '@/lib/mongodb'
import { requireAdminSession } from '@/lib/auth/session'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { validateInventoryUpdatePayload } from '@/lib/validation/inventory'
import { applyInventoryUpdate } from '@/services/inventoryService'

export async function POST(request) {
  try {
    const { response } = await requireAdminSession()
    if (response) return response

    await connectDB()
    const body = await request.json()
    const validationError = validateInventoryUpdatePayload(body)
    if (validationError) return errorResponse(validationError, 400)

    const result = await applyInventoryUpdate(body)
    if (result.error) return errorResponse(result.error, result.status || 400)

    return successResponse(JSON.parse(JSON.stringify(result.product)))
  } catch (err) {
    return handleApiError('inventory.update.post', err)
  }
}
