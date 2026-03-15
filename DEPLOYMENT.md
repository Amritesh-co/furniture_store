# Deployment Guide (No Docker/Kubernetes)

This project is deployment-ready for direct hosting of a Next.js app.

## Recommended Platform

Use **Vercel** for the fastest and simplest deployment flow.

## 1. Pre-Deploy Checks (Local)

Run these before every deployment:

```bash
npm ci
npm run lint
npm test
npm run build
```

## 2. Required Environment Variables

Set these in your hosting provider (Production scope):

```bash
NODE_ENV=production
NEXTAUTH_URL=https://<your-domain>
NEXTAUTH_SECRET=<strong-random-secret>
CORS_ORIGIN=https://<your-domain>

MONGODB_URI=<mongodb-connection-string>

CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

UPSTASH_REDIS_REST_URL=<upstash-url>
UPSTASH_REDIS_REST_TOKEN=<upstash-token>

EMAIL_HOST=<smtp-host>
EMAIL_PORT=<smtp-port>
EMAIL_USER=<smtp-user>
EMAIL_PASS=<smtp-password>
```

If you need a strong auth secret quickly:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Deploy On Vercel

### Option A: Vercel Dashboard

1. Push this repository to GitHub.
2. In Vercel, click **New Project** and import the repo.
3. Framework preset: **Next.js** (auto-detected).
4. Add all environment variables listed above.
5. Deploy.

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel env add
vercel --prod
```

## 4. Post-Deploy Smoke Tests

After production deploy, validate these flows:

1. Home/shop/product pages load.
2. Register/login works.
3. Cart -> checkout -> order success works.
4. Admin login and admin pages load.
5. Invoice actions work:
   - generate invoice
   - download PDF
   - send invoice email
6. Image upload works from admin product flow.

## 5. Known Production-Safety Notes

- Security headers and API CORS headers are configured in `next.config.js`.
- Redis-backed rate limiting is enabled when Upstash env vars are present.
- If Upstash vars are missing, app falls back to in-memory limiter (not recommended for production).

## 6. Rollback Strategy

If a deployment breaks:

1. Revert to the previous Vercel deployment from the Vercel dashboard.
2. Fix in a new branch.
3. Re-run checks (`lint`, `test`, `build`).
4. Promote a new production deployment.
