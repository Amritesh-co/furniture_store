import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'
import { errorResponse, handleApiError, successResponse } from '@/lib/response'
import { rateLimit, getClientIp } from '@/lib/api/rateLimit'
import { sanitizeString, isValidEmail, isValidPassword } from '@/lib/validation/common'

export async function POST(request) {
  try {
    const clientIp = getClientIp(request)
    const limit = await rateLimit(`register:${clientIp}`, 5, 60 * 60 * 1000)
    if (limit.limited) {
      return errorResponse(
        `Too many registration attempts. Retry in ${limit.retryAfter}s`,
        429,
        { headers: { 'Retry-After': String(limit.retryAfter) } }
      )
    }

    await connectDB()
    const body = await request.json()
    const name = sanitizeString(body?.name, 120)
    const email = sanitizeString(body?.email, 160).toLowerCase()
    const password = typeof body?.password === 'string' ? body.password : ''

    if (name.length < 2) {
      return errorResponse('Name must be at least 2 characters', 400)
    }

    if (!isValidEmail(email)) {
      return errorResponse('Valid email required', 400)
    }

    if (!isValidPassword(password)) {
      return errorResponse('Password must be at least 6 characters and include letters and numbers', 400)
    }

    const existing = await User.findOne({ email })
    if (existing) return errorResponse('Email already registered', 400)

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed, role: 'user' })

    return successResponse({ id: user._id, name: user.name, email: user.email }, 201)
  } catch (err) {
    return handleApiError('register.post', err)
  }
}
