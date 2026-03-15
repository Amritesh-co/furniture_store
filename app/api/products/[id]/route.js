import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { requireAdminSession } from '@/lib/auth/session'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { validateProductPayload } from '@/lib/validation/product'
import { validateObjectId } from '@/lib/validation/mongodb'
import { logInfo } from '@/lib/api/logger'

export async function GET(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const idError = validateObjectId(id, 'product id')
    if (idError) return errorResponse(idError, 400)

    const product = await Product.findById(id).lean()
    if (!product) return errorResponse('Not found', 404)
    return successResponse(JSON.parse(JSON.stringify(product)))
  } catch (err) {
    return handleApiError('products.id.get', err)
  }
}

export async function PUT(request, { params }) {
  try {
    const { response } = await requireAdminSession()
    if (response) return response

    await connectDB()
    const { id } = await params
    const idError = validateObjectId(id, 'product id')
    if (idError) return errorResponse(idError, 400)

    const body = await request.json()
    const validationError = validateProductPayload(body)
    if (validationError) return errorResponse(validationError, 400)

    const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!product) return errorResponse('Not found', 404)

    logInfo('product.updated', { productId: String(product._id) })
    return successResponse(JSON.parse(JSON.stringify(product)))
  } catch (err) {
    return handleApiError('products.id.put', err)
  }
}

export async function DELETE(request, { params }) {
  try {
    const { response } = await requireAdminSession()
    if (response) return response

    await connectDB()
    const { id } = await params
    const idError = validateObjectId(id, 'product id')
    if (idError) return errorResponse(idError, 400)

    await Product.findByIdAndDelete(id)
    logInfo('product.deleted', { productId: String(id) })
    return successResponse({ deleted: true })
  } catch (err) {
    return handleApiError('products.id.delete', err)
  }
}
