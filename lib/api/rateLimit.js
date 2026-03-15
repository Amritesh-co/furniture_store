import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const requestStore = new Map()
const localCache = new Map()
const ratelimiters = new Map()

let warnedAboutFallback = false
let redisClient = null

function getRedisClient() {
  if (redisClient) return redisClient

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    return null
  }

  redisClient = new Redis({ url, token })
  return redisClient
}

function getRatelimiter(maxRequests, windowMs) {
  const cacheKey = `${maxRequests}:${windowMs}`
  const existing = ratelimiters.get(cacheKey)
  if (existing) return existing

  const redis = getRedisClient()
  if (!redis) return null

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, `${Math.ceil(windowMs / 1000)} s`),
    ephemeralCache: localCache,
    analytics: false,
    prefix: 'ratelimit',
  })

  ratelimiters.set(cacheKey, limiter)
  return limiter
}

function warnFallbackOnce() {
  if (warnedAboutFallback) return

  warnedAboutFallback = true
  console.warn(JSON.stringify({
    level: 'warn',
    event: 'rate_limit.fallback_memory',
    message: 'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not configured. Falling back to in-memory rate limiting, which is not safe for multi-instance production.',
  }))
}

function warnRedisFailureOnce(error) {
  if (warnedAboutFallback) return

  warnedAboutFallback = true
  console.warn(JSON.stringify({
    level: 'warn',
    event: 'rate_limit.redis_unavailable',
    message: 'Upstash Redis rate limiting is unavailable. Falling back to in-memory rate limiting, which is not safe for multi-instance production.',
    error: error?.message,
  }))
}

function memoryRateLimit(key, maxRequests = 10, windowMs = 60_000) {
  const now = Date.now()
  const current = requestStore.get(key)

  if (!current || now > current.resetAt) {
    requestStore.set(key, { count: 1, resetAt: now + windowMs })
    return { limited: false, remaining: maxRequests - 1, retryAfter: 0 }
  }

  current.count += 1
  requestStore.set(key, current)

  if (current.count > maxRequests) {
    return {
      limited: true,
      remaining: 0,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    }
  }

  return {
    limited: false,
    remaining: Math.max(maxRequests - current.count, 0),
    retryAfter: 0,
  }
}

export async function rateLimit(key, maxRequests = 10, windowMs = 60_000) {
  const limiter = getRatelimiter(maxRequests, windowMs)

  if (!limiter) {
    warnFallbackOnce()
    return memoryRateLimit(key, maxRequests, windowMs)
  }

  let result

  try {
    result = await limiter.limit(key)
  } catch (error) {
    warnRedisFailureOnce(error)
    return memoryRateLimit(key, maxRequests, windowMs)
  }

  return {
    limited: !result.success,
    remaining: result.remaining,
    retryAfter: result.success ? 0 : Math.max(0, Math.ceil((result.reset - Date.now()) / 1000)),
    limit: result.limit,
    resetAt: result.reset,
  }
}

export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()

  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp

  return 'unknown'
}
