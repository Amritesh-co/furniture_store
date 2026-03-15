export function validateOrderPayload(body) {
  if (!body || typeof body !== 'object') return 'Invalid request body'

  const requiredCustomerFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode']
  const customerInfo = body.customerInfo || {}

  for (const field of requiredCustomerFields) {
    if (!customerInfo[field]) return `customerInfo.${field} is required`
  }

  if (!Array.isArray(body.products) || body.products.length === 0) {
    return 'products must be a non-empty array'
  }

  for (const item of body.products) {
    if (!item?.productId) return 'Each product must include productId'
    if (!item?.name) return 'Each product must include name'
    if (typeof item?.price !== 'number' || item.price < 0) return 'Each product price must be a non-negative number'
    if (!Number.isInteger(item?.quantity) || item.quantity < 1) return 'Each product quantity must be a positive integer'
  }

  if (typeof body.subtotal !== 'number' || body.subtotal < 0) return 'subtotal must be a non-negative number'
  if (typeof body.shipping !== 'number' || body.shipping < 0) return 'shipping must be a non-negative number'
  if (typeof body.total !== 'number' || body.total < 0) return 'total must be a non-negative number'

  return null
}
