import { requireAdminSession } from '@/lib/auth/session'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { getBusinessInfo, updateBusinessInfo } from '@/lib/settingsService'
import { sanitizeString, isValidEmail } from '@/lib/validation/common'

function normalizePayload(body) {
  const businessInfo = body?.businessInfo || {}

  const normalized = {
    brandName: sanitizeString(businessInfo.brandName, 80),
    displayName: sanitizeString(businessInfo.displayName, 120),
    legalName: sanitizeString(businessInfo.legalName, 160),
    email: sanitizeString(businessInfo.email, 160).toLowerCase(),
    phone: sanitizeString(businessInfo.phone, 32),
    phoneDisplay: sanitizeString(businessInfo.phoneDisplay, 48),
    whatsappNumber: sanitizeString(businessInfo.whatsappNumber, 24).replace(/\D/g, ''),
    instagramUrl: sanitizeString(businessInfo.instagramUrl, 260),
    instagramHandle: sanitizeString(businessInfo.instagramHandle, 80),
    addressLine1: sanitizeString(businessInfo.addressLine1, 160),
    addressLine2: sanitizeString(businessInfo.addressLine2, 160),
    shortAddress: sanitizeString(businessInfo.shortAddress, 180),
  }

  return normalized
}

function validatePayload(info) {
  if (!info.displayName) return 'Display name is required'
  if (!info.legalName) return 'Legal name is required'
  if (!info.email || !isValidEmail(info.email)) return 'Valid support email is required'
  if (!info.phone) return 'Contact number is required'
  if (!info.whatsappNumber) return 'WhatsApp number is required'
  if (!info.addressLine1 || !info.addressLine2) return 'Address line 1 and line 2 are required'
  return null
}

export async function GET() {
  try {
    const { response } = await requireAdminSession()
    if (response) return response

    const businessInfo = await getBusinessInfo()
    return successResponse({ businessInfo })
  } catch (error) {
    return handleApiError('admin.settings.get', error)
  }
}

export async function PUT(request) {
  try {
    const { response } = await requireAdminSession()
    if (response) return response

    const body = await request.json()
    const normalized = normalizePayload(body)
    const validationError = validatePayload(normalized)
    if (validationError) return errorResponse(validationError, 400)

    const businessInfo = await updateBusinessInfo(normalized)
    return successResponse({ businessInfo })
  } catch (error) {
    if (error instanceof SyntaxError) return errorResponse('Invalid request payload', 400)
    return handleApiError('admin.settings.put', error)
  }
}
