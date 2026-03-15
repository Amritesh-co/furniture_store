import connectDB from '@/lib/mongodb'
import ShopDay from '@/lib/models/ShopDay'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { errorResponse, handleApiError, successResponse } from '@/lib/response'

// Cache refresh: 2026-03-14 03:10

async function checkAuth() {
  const session = await getServerSession(authOptions)
  return session?.user?.role === 'admin' || session?.user?.role === 'manager'
}

export async function GET(req) {
  if (!(await checkAuth())) {
    return errorResponse('Unauthorized', 401)
  }
  const dateStr = req.nextUrl.searchParams.get('date')
  if (!dateStr) return errorResponse('Date is required', 400)

  try {
    await connectDB()
    const date = new Date(dateStr)
    date.setHours(0, 0, 0, 0)
    const shopDay = await ShopDay.findOne({ date })
    return successResponse(shopDay || { open: null })
  } catch (err) {
    return handleApiError('shopday.get', err)
  }
}

export async function POST(req) {
  if (!(await checkAuth())) {
    return errorResponse('Unauthorized', 401)
  }
  try {
    await connectDB()
    const { date: dStr, open } = await req.json()
    const date = new Date(dStr)
    date.setHours(0, 0, 0, 0)
    
    const shopDay = await ShopDay.findOneAndUpdate(
      { date },
      { date, open },
      { upsert: true, new: true }
    )
    return successResponse(shopDay)
  } catch (err) {
    if (err instanceof SyntaxError) {
      return errorResponse('Invalid request payload', 400)
    }
    return handleApiError('shopday.post', err)
  }
}
