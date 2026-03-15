import connectDB from '@/lib/mongodb'
import Attendance from '@/lib/models/Attendance'
import Employee from '@/lib/models/Employee'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { errorResponse, handleApiError, successResponse } from '@/lib/response'

// Cache refresh: 2026-03-14 03:15

async function checkAuth() {
  const session = await getServerSession(authOptions)
  return session?.user?.role === 'admin' || session?.user?.role === 'manager'
}

export async function GET(req) {
  if (!(await checkAuth())) {
    return errorResponse('Unauthorized', 401)
  }
  
  const dateStr = req.nextUrl.searchParams.get('date')
  const isWeekly = req.nextUrl.searchParams.get('weekly') === 'true'

  try {
    await connectDB()
    
    if (isWeekly) {
      // Weekly report logic
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - 7)
      
      const report = await Attendance.aggregate([
        { $match: { date: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: '$employeeId',
            presentCount: { $sum: { $cond: ['$present', 1, 0] } },
            absentCount: { $sum: { $cond: ['$present', 0, 1] } },
            earlyLeaveCount: { $sum: { $cond: ['$earlyLeave', 1, 0] } }
          }
        },
        {
          $lookup: {
            from: 'employees',
            localField: '_id',
            foreignField: '_id',
            as: 'employee'
          }
        },
        { $unwind: '$employee' }
      ])
      return successResponse(report)
    }

    if (!dateStr) return errorResponse('Date required', 400)
    const date = new Date(dateStr)
    date.setHours(0, 0, 0, 0)
    const attendance = await Attendance.find({ date })
    return successResponse(attendance)

  } catch (err) {
    return handleApiError('attendance.get', err)
  }
}

export async function POST(req) {
  if (!(await checkAuth())) {
    return errorResponse('Unauthorized', 401)
  }
  try {
    await connectDB()
    const { date: dStr, attendanceData } = await req.json()
    const date = new Date(dStr)
    date.setHours(0, 0, 0, 0)

    const operations = attendanceData.map(item => ({
      updateOne: {
        filter: { employeeId: item.employeeId, date },
        update: { ...item, date },
        upsert: true
      }
    }))

    await Attendance.bulkWrite(operations)
    return successResponse({ message: 'Success' })
  } catch (err) {
    if (err instanceof SyntaxError) {
      return errorResponse('Invalid request payload', 400)
    }
    return handleApiError('attendance.post', err)
  }
}
