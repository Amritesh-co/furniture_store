import Product from '@/lib/models/Product'
import InventoryLog from '@/lib/models/InventoryLog'
import { logInfo } from '@/lib/api/logger'

export async function applyInventoryUpdate({ productId, changeType, quantity, reason }) {
  const product = await Product.findById(productId)
  if (!product) return { error: 'Product not found', status: 404 }

  const previousStock = product.stock
  let newStock = previousStock

  if (changeType === 'increase') newStock += quantity
  else if (changeType === 'decrease') newStock = Math.max(0, previousStock - quantity)
  else if (changeType === 'manual_adjustment') newStock = quantity

  product.stock = newStock
  await product.save()

  await InventoryLog.create({
    productId: product._id,
    productName: product.name,
    changeType,
    quantityChanged: Math.abs(newStock - previousStock),
    previousStock,
    newStock,
    reason: reason || 'admin_edit',
  })

  logInfo('inventory.updated', {
    productId: String(product._id),
    changeType,
    quantity,
    previousStock,
    newStock,
  })

  return { product }
}
