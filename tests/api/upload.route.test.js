import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/auth/session', () => ({
  requireAdminSession: vi.fn(),
}))

vi.mock('@/lib/api/rateLimit', () => ({
  rateLimit: vi.fn(),
  getClientIp: vi.fn(),
}))

vi.mock('@/lib/cloudinary', () => ({
  getCloudinary: vi.fn(),
  getOptimizedCloudinaryUrl: vi.fn(),
}))

import { requireAdminSession } from '@/lib/auth/session'
import { rateLimit, getClientIp } from '@/lib/api/rateLimit'
import { POST } from '@/app/api/upload/route'

function createRequest(formData) {
  return {
    headers: new Headers(),
    formData: vi.fn().mockResolvedValue(formData),
  }
}

describe('/api/upload POST', () => {
  beforeEach(() => {
    requireAdminSession.mockResolvedValue({ response: null })
    getClientIp.mockReturnValue('127.0.0.1')
    rateLimit.mockResolvedValue({ limited: false, retryAfter: 0 })
  })

  it('rejects a file larger than 5MB', async () => {
    const formData = new FormData()
    const oversizedFile = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.png', {
      type: 'image/png',
    })

    formData.append('images', oversizedFile)

    const response = await POST(createRequest(formData))
    const body = await response.json()

    expect(response.status).toBe(413)
    expect(body).toEqual({
      success: false,
      error: 'File too large: large.png (max 5MB)',
    })
  })

  it('rejects unsupported file types', async () => {
    const formData = new FormData()
    const textFile = new File(['bad'], 'bad.txt', { type: 'text/plain' })

    formData.append('images', textFile)

    const response = await POST(createRequest(formData))
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.success).toBe(false)
    expect(body.error).toContain('Unsupported file type')
  })
})
