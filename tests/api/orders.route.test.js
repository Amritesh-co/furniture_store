import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/mongodb', () => ({
  default: vi.fn(),
}))

vi.mock('@/lib/models/Order', () => ({
  default: {
    find: vi.fn(),
  },
}))

vi.mock('@/lib/auth/session', () => ({
  requireAdminSession: vi.fn(),
  requireUserSession: vi.fn(),
}))

vi.mock('@/lib/validation/order', () => ({
  validateOrderPayload: vi.fn(),
}))

vi.mock('@/services/orderService', () => ({
  createOrderWithInventoryAdjustments: vi.fn(),
}))

vi.mock('@/services/invoiceService', () => ({
  autoGenerateAndSendInvoiceForOrder: vi.fn(),
}))

import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import { requireAdminSession, requireUserSession } from '@/lib/auth/session'
import { validateOrderPayload } from '@/lib/validation/order'
import { createOrderWithInventoryAdjustments } from '@/services/orderService'
import { autoGenerateAndSendInvoiceForOrder } from '@/services/invoiceService'
import { GET, POST } from '@/app/api/orders/route'

describe('/api/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    connectDB.mockResolvedValue(undefined)
  })

  it('returns forbidden when listing orders without an admin session', async () => {
    requireAdminSession.mockResolvedValue({ session: null, response: {} })

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(403)
    expect(body).toEqual({ success: false, error: 'Forbidden' })
  })

  it('rejects invalid order payloads', async () => {
    requireUserSession.mockResolvedValue({
      session: { user: { id: 'user-1' } },
      response: null,
    })
    validateOrderPayload.mockReturnValue('products must be a non-empty array')

    const response = await POST({
      json: vi.fn().mockResolvedValue({ customerInfo: {} }),
    })
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({ success: false, error: 'products must be a non-empty array' })
  })

  it('creates an order for a valid payload', async () => {
    const createdOrder = { _id: 'order-1', total: 4999 }

    requireUserSession.mockResolvedValue({
      session: { user: { id: 'user-1' } },
      response: null,
    })
    validateOrderPayload.mockReturnValue(null)
    createOrderWithInventoryAdjustments.mockResolvedValue(createdOrder)
    autoGenerateAndSendInvoiceForOrder.mockResolvedValue({ success: true, invoiceId: 'INV-001' })

    const response = await POST({
      json: vi.fn().mockResolvedValue({
        customerInfo: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          address: 'Address',
          city: 'City',
          state: 'State',
          pincode: '123456',
        },
        products: [
          { productId: 'product-1', name: 'Chair', price: 4999, quantity: 1 },
        ],
        subtotal: 4999,
        shipping: 0,
        total: 4999,
      }),
    })
    const body = await response.json()

    expect(createOrderWithInventoryAdjustments).toHaveBeenCalledWith(expect.any(Object), 'user-1')
    expect(autoGenerateAndSendInvoiceForOrder).toHaveBeenCalledWith(createdOrder, 'user-1')
    expect(response.status).toBe(201)
    expect(body).toEqual({ success: true, data: createdOrder })
  })
})
