import { v2 as cloudinary } from 'cloudinary'

let isConfigured = false

function normalizeEnv(value) {
  if (typeof value !== 'string') return ''

  // Prevent subtle signature issues caused by copied secrets with spaces/newlines/quotes.
  return value.trim().replace(/^['\"]|['\"]$/g, '')
}

function requireEnv(name) {
  const value = normalizeEnv(process.env[name])
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export function getCloudinary() {
  if (!isConfigured) {
    const cloudName = requireEnv('CLOUDINARY_CLOUD_NAME')
    const apiKey = requireEnv('CLOUDINARY_API_KEY')
    const apiSecret = requireEnv('CLOUDINARY_API_SECRET')

    if (!/^[0-9]+$/.test(apiKey)) {
      throw new Error('CLOUDINARY_API_KEY must be numeric')
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    })
    isConfigured = true
  }

  return cloudinary
}

export function getOptimizedCloudinaryUrl(publicId) {
  const client = getCloudinary()
  return client.url(publicId, {
    secure: true,
    fetch_format: 'auto',
    quality: 'auto',
  })
}
