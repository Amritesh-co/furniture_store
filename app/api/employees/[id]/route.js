import connectDB from '@/lib/mongodb'
import Employee from '@/lib/models/Employee'
import { requireAdminSession } from '@/lib/auth/session'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { logInfo } from '@/lib/api/logger'
import { validateObjectId } from '@/lib/validation/mongodb'

export async function GET(req, { params }) {
  const { response } = await requireAdminSession()
  if (response) return response

  try {
    await connectDB()
    const { id } = await params
    const idError = validateObjectId(id, 'employee id')
    if (idError) return errorResponse(idError, 400)

    const employee = await Employee.findById(id)
    if (!employee) return errorResponse('Not found', 404)
    return successResponse(employee)
  } catch (err) {
    return handleApiError('employees.id.get', err)
  }
}

export async function PUT(req, { params }) {
  const { response } = await requireAdminSession()
  if (response) return response

  try {
    await connectDB()
    const { id } = await params
    const idError = validateObjectId(id, 'employee id')
    if (idError) return errorResponse(idError, 400)

    const body = await req.json()
    const employee = await Employee.findByIdAndUpdate(id, body, { new: true })
    if (!employee) return errorResponse('Not found', 404)

    logInfo('employee.updated', { employeeMongoId: String(employee._id) })
    return successResponse(employee)
  } catch (err) {
    return handleApiError('employees.id.put', err)
  }
}

export async function DELETE(req, { params }) {
  const { response } = await requireAdminSession()
  if (response) return response

  try {
    await connectDB()
    const { id } = await params
    const idError = validateObjectId(id, 'employee id')
    if (idError) return errorResponse(idError, 400)

    const employee = await Employee.findByIdAndDelete(id)
    if (!employee) return errorResponse('Not found', 404)

    logInfo('employee.deleted', { employeeMongoId: String(id) })
    return successResponse({ message: 'Deleted' })
  } catch (err) {
    return handleApiError('employees.id.delete', err)
  }
}
