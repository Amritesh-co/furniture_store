import { NextResponse } from 'next/server'

export function successResponse(data = {}, status = 200, init = {}) {
  return NextResponse.json({ success: true, data }, { status, ...init })
}

export function errorResponse(message, status = 500, init = {}) {
  return NextResponse.json({ success: false, error: message }, { status, ...init })
}

export function handleApiError(contextOrError, maybeError) {
  const context = maybeError === undefined ? 'api.error' : contextOrError
  const error = maybeError === undefined ? contextOrError : maybeError
  const isDev = process.env.NODE_ENV !== 'production'
  const safeMessage = isDev
    ? (error?.message || 'Internal server error')
    : 'Internal server error'

  console.error(JSON.stringify({
    level: 'error',
    context,
    message: error?.message,
    stack: error?.stack,
  }))

  return errorResponse(safeMessage, 500)
}
