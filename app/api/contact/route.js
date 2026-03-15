import { sendContactEmail } from '@/lib/emailSender'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { rateLimit, getClientIp } from '@/lib/api/rateLimit'
import { sanitizeString, isValidEmail } from '@/lib/validation/common'

export async function POST(req) {
  try {
    const clientIp = getClientIp(req)
    const limit = await rateLimit(`contact:${clientIp}`, 10, 60_000)
    if (limit.limited) {
      return errorResponse(
        `Too many requests. Retry in ${limit.retryAfter}s`,
        429,
        { headers: { 'Retry-After': String(limit.retryAfter) } }
      )
    }

    const body = await req.json()
    const name = sanitizeString(body?.name, 120)
    const email = sanitizeString(body?.email, 160).toLowerCase()
    const subject = sanitizeString(body?.subject, 200)
    const message = sanitizeString(body?.message, 2000)

    // Basic validation
    if (!name || !email || !message) {
      return errorResponse('Name, email, and message are required.', 400)
    }

    if (!isValidEmail(email)) {
      return errorResponse('Valid email is required.', 400)
    }

    const result = await sendContactEmail({ name, email, subject, message })

    if (result.success) {
      return successResponse({ sent: true })
    }

    return errorResponse(result.error || 'Failed to send email.', 500)
  } catch (error) {
    return handleApiError('contact.post', error)
  }
}
