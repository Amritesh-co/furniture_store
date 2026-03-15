import connectDB from '@/lib/mongodb'
import CustomInquiry from '@/lib/models/CustomInquiry'
import { sendCustomInquiryEmail } from '@/lib/emailSender'
import { requireAdminSession } from '@/lib/auth/session'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { logError } from '@/lib/api/logger'
import { rateLimit, getClientIp } from '@/lib/api/rateLimit'
import { sanitizeString, isValidEmail } from '@/lib/validation/common'

export async function POST(request) {
  try {
    const clientIp = getClientIp(request)
    const limit = await rateLimit(`custom-inquiry:${clientIp}`, 10, 60 * 60 * 1000)
    if (limit.limited) {
      return errorResponse(`Too many requests. Retry in ${limit.retryAfter}s`, 429)
    }

    await connectDB()
    const payload = await request.json()
    const body = {
      name: sanitizeString(payload?.name, 120),
      email: sanitizeString(payload?.email, 160).toLowerCase(),
      phone: sanitizeString(payload?.phone, 30),
      furnitureType: sanitizeString(payload?.furnitureType, 40),
      budget: payload?.budget,
      requirements: sanitizeString(payload?.requirements, 3000),
    }

    if (!body.name || !body.email || !body.phone || !body.furnitureType || !body.requirements) {
      return errorResponse('Missing required inquiry fields', 400)
    }

    if (!isValidEmail(body.email)) {
      return errorResponse('Invalid email', 400)
    }

    const inquiry = await CustomInquiry.create(body)

    // Send email notification using the newly created helper
    const emailResult = await sendCustomInquiryEmail(body)
    if (!emailResult.success) {
      logError('customInquiry.email.failed', new Error(emailResult.error || 'Unknown email error'))
      // We don't fail the request here because the DB insertion succeeded, 
      // but you might want to handle it differently depending on preference.
    }

    return successResponse(JSON.parse(JSON.stringify(inquiry)), 201)
  } catch (err) {
    return handleApiError('customInquiry.post', err)
  }
}

export async function GET() {
  try {
    const { response } = await requireAdminSession()
    if (response) return response

    await connectDB()
    const inquiries = await CustomInquiry.find().sort({ createdAt: -1 }).lean()
    return successResponse(JSON.parse(JSON.stringify(inquiries)))
  } catch (err) {
    return handleApiError('customInquiry.get', err)
  }
}
