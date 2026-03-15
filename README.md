This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Create `.env.local` with the following values:

```bash
MONGODB_URI=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# Cloudinary image uploads
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Upstash Redis rate limiting
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

### Rate Limiting Notes

- API rate limiting uses Redis-backed counters via Upstash.
- This works across multiple app instances and survives process restarts.
- If Upstash credentials are missing, the app falls back to in-memory limiting and logs a warning. That fallback is only appropriate for local development.

## Production Readiness Checklist

Before deploying, verify the following:

- Set `NODE_ENV=production`.
- Set `MONGODB_URI` to your production MongoDB cluster.
- Set `NEXTAUTH_SECRET` to a strong random value.
- Set `NEXTAUTH_URL` to your deployed app URL (for example, `https://your-domain.com`).
- Set `CORS_ORIGIN` to your frontend origin (or comma-separated list if needed).
- Set Cloudinary credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
- Set Upstash credentials (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) to avoid in-memory rate-limit fallback.
- Set SMTP credentials used by invoice email features (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`).
- Run quality gates locally before deploy:
	- `npm run lint`
	- `npm test`
	- `npm run build`

Notes:

- App responses include basic security headers (nosniff, frame deny, referrer policy, permissions policy).
- API CORS headers are configured in `next.config.js`.

### Cloudinary Upload Notes

- Product image uploads use `/api/upload`.
- Accepted image MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/avif`.
- Max file size: `5MB` per image.
- Uploaded files are stored in Cloudinary folder: `furniture_store`.
- API response includes:
	- `success: true`
	- `files: string[]` (Cloudinary URLs)
	- `urls: string[]` (backward-compatible alias used by existing admin UI)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

For a full step-by-step production rollout, see `DEPLOYMENT.md`.
