import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/mongodb', () => ({
  default: vi.fn(),
}))

vi.mock('@/lib/models/Product', () => ({
  default: {
    countDocuments: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('@/lib/auth/session', () => ({
  requireAdminSession: vi.fn(),
}))

vi.mock('@/lib/validation/product', () => ({
  validateProductPayload: vi.fn(),
}))

vi.mock('@/lib/api/logger', () => ({
  logInfo: vi.fn(),
}))

import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { requireAdminSession } from '@/lib/auth/session'
import { validateProductPayload } from '@/lib/validation/product'
import { GET, POST } from '@/app/api/products/route'

describe('/api/products', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    connectDB.mockResolvedValue(undefined)
  })

  it('returns paginated products for shop queries', async () => {
    const products = [{ _id: 'product-1', name: 'Chair', price: 4999 }]
    const lean = vi.fn().mockResolvedValue(products)
    const limit = vi.fn().mockReturnValue({ lean })
    const skip = vi.fn().mockReturnValue({ limit })
    const sort = vi.fn().mockReturnValue({ skip })

    Product.countDocuments.mockResolvedValue(1)
    Product.find.mockReturnValue({ sort })

    const response = await GET({
      url: 'http://localhost:3000/api/products?page=1&limit=9&sort=newest',
    })
    const body = await response.json()

    expect(Product.countDocuments).toHaveBeenCalledWith({})
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 })
    expect(skip).toHaveBeenCalledWith(0)
    expect(limit).toHaveBeenCalledWith(9)
    expect(response.status).toBe(200)
    expect(body).toEqual({
      success: true,
      data: {
        products,
        total: 1,
        pages: 1,
        page: 1,
      },
    })
  })

  it('rejects invalid product payloads', async () => {
    requireAdminSession.mockResolvedValue({ response: null })
    validateProductPayload.mockReturnValue('name is required')

    const response = await POST({
      json: vi.fn().mockResolvedValue({}),
    })
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({ success: false, error: 'name is required' })
  })
})