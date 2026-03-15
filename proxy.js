import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isUserRoute = req.nextUrl.pathname.startsWith('/cart') || req.nextUrl.pathname.startsWith('/checkout')

    if (isAdminRoute && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login?error=unauthorized', req.url))
    }

    if (isUserRoute && !token) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${req.nextUrl.pathname}`, req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/cart', '/checkout'],
}
