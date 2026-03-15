import Order from '@/lib/models/Order'
import Product from '@/lib/models/Product'
import InventoryLog from '@/lib/models/InventoryLog'
import OrderSequence from '@/lib/models/OrderSequence'
import { logInfo } from '@/lib/api/logger'

function getIndiaDateKey(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(now)

  const byType = Object.fromEntries(parts.filter((p) => p.type !== 'literal').map((p) => [p.type, p.value]))
  return `${byType.day}${byType.month}${byType.year}`
}

async function generateOrderTrackingId() {
  const dateKey = getIndiaDateKey()

  const counter = await OrderSequence.findOneAndUpdate(
    { dateKey },
    { $inc: { sequence: 1 }, $setOnInsert: { dateKey } },
    { new: true, upsert: true }
  )

  const sequence = String(counter.sequence).padStart(3, '0')
  return `${dateKey}${sequence}`
}

export async function createOrderWithInventoryAdjustments(orderBody, userId) {
  const orderId = await generateOrderTrackingId()
  const payload = { ...orderBody, userId, orderId }
  const order = await Order.create(payload)

  for (const item of payload.products) {
    const product = await Product.findById(item.productId)
    if (product && product.stock >= item.quantity) {
      const previousStock = product.stock
      product.stock -= item.quantity
      product.sales = (product.sales || 0) + item.quantity
      await product.save()

      await InventoryLog.create({
        productId: product._id,
        productName: product.name,
        changeType: 'decrease',
        quantityChanged: item.quantity,
        previousStock,
        newStock: product.stock,
        reason: 'order',
      })
    }
  }

  logInfo('order.created', {
    orderMongoId: String(order._id),
    orderId: order.orderId,
    userId: String(userId),
    itemCount: payload.products.length,
    total: payload.total,
  })

  return order
}
