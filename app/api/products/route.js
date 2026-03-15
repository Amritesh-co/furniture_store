import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { requireAdminSession } from '@/lib/auth/session'
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response'
import { validateProductPayload } from '@/lib/validation/product'
import { logInfo } from '@/lib/api/logger'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'newest'
    const material = searchParams.get('material')
    const available = searchParams.get('available')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const searchQuery = searchParams.get('search')

    const query = {}
    if (category) query.category = category
    if (material) query.material = { $regex: material, $options: 'i' }
    if (available === 'true') query.status = { $ne: 'outOfStock' }
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseInt(minPrice)
      if (maxPrice) query.price.$lte = parseInt(maxPrice)
    }
    if (searchQuery) {
      // Split search into words for a more flexible multi-word regex search as fallback
      const words = searchQuery.split(/\s+/).filter(w => w.length > 0)
      const keywordRegex = words.map(w => ({
        $or: [
          { name: { $regex: w, $options: 'i' } },
          { description: { $regex: w, $options: 'i' } },
          { category: { $regex: w, $options: 'i' } },
          { material: { $regex: w, $options: 'i' } }
        ]
      }))

      // Try text search first (requires text index)
      try {
        query.$text = { $search: searchQuery }
        // Verify index exists by doing a small count check
        await Product.countDocuments({ $text: { $search: 'test' } }).limit(1)
      } catch (err) {
        // Fallback to multi-keyword regex if text index is missing
        delete query.$text
        query.$and = keywordRegex
      }
    }

    const sortMap = {
      relevance: query.$text ? { score: { $meta: 'textScore' } } : { createdAt: -1 },
      newest: { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'best-selling': { sales: -1 },
    }
    
    let sortObj = sortMap[sort]
    if (!sortObj) {
      sortObj = searchQuery && query.$text ? sortMap.relevance : sortMap.newest
    }

    const total = await Product.countDocuments(query)
    let findQuery = Product.find(query)
    
    if (query.$text && (!sort || sort === 'relevance')) {
      findQuery = findQuery.select({ score: { $meta: 'textScore' } })
    }

    const products = await findQuery
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    return successResponse({
      products: JSON.parse(JSON.stringify(products)),
      total,
      pages: Math.ceil(total / limit),
      page,
    })
  } catch (err) {
    return handleApiError('products.get', err)
  }
}

export async function POST(request) {
  try {
    const { response } = await requireAdminSession()
    if (response) return response

    await connectDB()
    const body = await request.json()
    const validationError = validateProductPayload(body)
    if (validationError) return errorResponse(validationError, 400)

    const product = await Product.create(body)
    logInfo('product.created', { productId: String(product._id), name: product.name })
    return successResponse(product, 201)
  } catch (err) {
    return handleApiError('products.post', err)
  }
}
