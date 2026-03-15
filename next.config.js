/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  // Prevent pdfkit & nodemailer from being bundled by webpack.
  // pdfkit needs access to its own font files (Helvetica.afm etc.) on disk at runtime.
  serverExternalPackages: ['pdfkit', 'nodemailer'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  // Security and API headers.
  async headers() {
    const isProd = process.env.NODE_ENV === 'production'
    const configuredOrigins = (process.env.CORS_ORIGIN || process.env.NEXTAUTH_URL || 'http://localhost:3000')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
    const primaryAllowedOrigin = configuredOrigins[0] || 'http://localhost:3000'

    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ]

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/api/:path*',
        headers: [
          // In production we only allow a single configured origin value here.
          // If you need multiple origins, set this dynamically at runtime per request.
          { key: 'Access-Control-Allow-Origin', value: isProd ? primaryAllowedOrigin : '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, Cookie' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Vary', value: 'Origin' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
