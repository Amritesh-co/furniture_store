import { successResponse, handleApiError } from '@/lib/api/response'
import { getBusinessInfo } from '@/lib/settingsService'

export async function GET() {
  try {
    const businessInfo = await getBusinessInfo()
    return successResponse({ businessInfo })
  } catch (error) {
    return handleApiError('settings.get', error)
  }
}
