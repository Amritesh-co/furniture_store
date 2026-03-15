const VALID_CHANGE_TYPES = ['increase', 'decrease', 'manual_adjustment']
const VALID_REASONS = ['order', 'restock', 'admin_edit']

export function validateInventoryUpdatePayload(body) {
  if (!body || typeof body !== 'object') return 'Invalid request body'

  if (!body.productId) return 'productId is required'
  if (!VALID_CHANGE_TYPES.includes(body.changeType)) return 'Invalid changeType'
  if (!Number.isInteger(body.quantity) || body.quantity < 0) return 'quantity must be a non-negative integer'
  if (body.reason && !VALID_REASONS.includes(body.reason)) return 'Invalid reason'

  return null
}
