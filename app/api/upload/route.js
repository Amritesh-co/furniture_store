import { requireAdminSession } from '@/lib/auth/session'
import { rateLimit, getClientIp } from '@/lib/api/rateLimit'
import { getCloudinary, getOptimizedCloudinaryUrl } from '@/lib/cloudinary'
import { errorResponse, handleApiError, successResponse } from '@/lib/response'

function uploadBufferToCloudinary(buffer, options) {
  const client = getCloudinary()
  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error)
        return
      }
      resolve(result)
    })

    stream.end(buffer)
  })
}

export async function POST(request) {
  const { response } = await requireAdminSession()
  if (response) return response

  try {
    const clientIp = getClientIp(request)
    const limit = await rateLimit(`upload:${clientIp}`, 30, 60_000)
    if (limit.limited) {
      return errorResponse(
        `Too many upload requests. Retry in ${limit.retryAfter}s`,
        429,
        { headers: { 'Retry-After': String(limit.retryAfter) } }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('images')

    const MAX_FILE_SIZE = 5 * 1024 * 1024
    const MIME_TO_EXT = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/avif': 'avif',
    }
    const ALLOWED_TYPES = new Set(Object.keys(MIME_TO_EXT))

    if (!files || files.length === 0) {
      return errorResponse('No files received.', 400)
    }

    const uploadedUrls = []

    for (const file of files) {
      if (!(file instanceof File)) {
        return errorResponse('Invalid upload payload.', 400)
      }

      if (!ALLOWED_TYPES.has(file.type)) {
        return errorResponse(`Unsupported file type for ${file.name || 'file'}. Allowed: JPEG, PNG, WEBP, AVIF`, 400)
      }

      if (file.size > MAX_FILE_SIZE) {
        return errorResponse(`File too large: ${file.name || 'file'} (max 5MB)`, 413)
      }
      
      const buffer = Buffer.from(await file.arrayBuffer())
      const extension = MIME_TO_EXT[file.type]

      const result = await uploadBufferToCloudinary(buffer, {
        folder: 'furniture_store',
        resource_type: 'image',
        unique_filename: true,
        overwrite: false,
        format: extension,
      })

      const optimizedUrl = getOptimizedCloudinaryUrl(result.public_id)
      uploadedUrls.push(optimizedUrl || result.secure_url)
    }

    return successResponse(
      {
        files: uploadedUrls,
        // Keep backward compatibility with existing admin UI code.
        urls: uploadedUrls,
      },
      201
    )
  } catch (error) {
    console.error('Error uploading image:', {
      message: error?.message,
      httpCode: error?.error?.http_code || error?.http_code,
      code: error?.error?.code || error?.code,
    })
    return handleApiError('upload.post', error)
  }
}
