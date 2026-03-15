const VALID_CATEGORIES = ['Sofas', 'Chairs', 'Tables', 'Beds', 'Storage']

export function validateProductPayload(body) {
  if (!body || typeof body !== 'object') return 'Invalid request body'

  const required = ['name', 'price', 'description', 'category', 'material', 'dimensions']
  for (const field of required) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return `${field} is required`
    }
  }

  if (typeof body.price !== 'number' || body.price < 0) return 'price must be a non-negative number'
  if (body.stock !== undefined && (!Number.isInteger(body.stock) || body.stock < 0)) return 'stock must be a non-negative integer'
  if (!VALID_CATEGORIES.includes(body.category)) return 'Invalid category'

  return null
}
