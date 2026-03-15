import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Order from '@/lib/models/Order'
import User from '@/lib/models/User'
import CustomInquiry from '@/lib/models/CustomInquiry'
import { requireAdminSession } from '@/lib/auth/session'
import { successResponse, handleApiError } from '@/lib/api/response'

export async function GET() {
  try {
    const { response } = await requireAdminSession()
    if (response) return response

    await connectDB()
    const [totalProducts, totalOrders, totalUsers, lowStockProducts, orders, totalInquiries] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.find({ status: { $in: ['lowStock', 'outOfStock'] } }).lean(),
      Order.find().lean(),
      CustomInquiry.countDocuments(),
    ])

    const revenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0)

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).lean()

    return successResponse({
      totalProducts,
      totalOrders,
      totalUsers,
      revenue,
      totalInquiries,
      lowStockProducts: JSON.parse(JSON.stringify(lowStockProducts)),
      recentOrders: JSON.parse(JSON.stringify(recentOrders)),
    })
  } catch (err) {
    return handleApiError('admin.stats.get', err)
  }
}
