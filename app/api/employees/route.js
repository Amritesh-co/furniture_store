import connectDB from '@/lib/mongodb'
import Employee from '@/lib/models/Employee'
import { requireAdminSession } from '@/lib/auth/session'
import { successResponse, handleApiError } from '@/lib/api/response'
import { logInfo } from '@/lib/api/logger'

// Cache refresh: 2026-03-14 03:15

export async function GET() {
  const { response } = await requireAdminSession()
  if (response) return response

  try {
    await connectDB()
    const employees = await Employee.find({}).sort({ name: 1 })
    return successResponse(employees)
  } catch (err) {
    return handleApiError('employees.get', err)
  }
}

export async function POST(req) {
  const { response } = await requireAdminSession()
  if (response) return response

  try {
    await connectDB()
    const body = await req.json()
    const employee = await Employee.create(body)
    logInfo('employee.created', { employeeMongoId: String(employee._id), employeeId: employee.employeeId })
    return successResponse(employee, 201)
  } catch (err) {
    return handleApiError('employees.post', err)
  }
}
