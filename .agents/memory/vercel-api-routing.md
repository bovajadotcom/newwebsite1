---
name: Vercel API routing
description: How the Vercel deployment serves both the static site and the existing Express API without a second backend or database.
---

The Vercel project uses the automotive site's directory as its root. Serverless entrypoints there reuse the existing Express application and its Neon PostgreSQL connection; do not recreate API routes or databases for Vercel.

**Why:** A blanket SPA rewrite otherwise sends `/api/*` to the frontend document, causing data endpoints such as vehicle inventory to return HTML instead of JSON.

**How to apply:** Keep Vercel's filesystem routing ahead of the SPA fallback so functions resolve first, while all non-file browser routes still serve the frontend entry document. Production requires the existing `DATABASE_URL` and `SESSION_SECRET` values.