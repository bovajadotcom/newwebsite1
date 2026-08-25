---
name: Vercel API routing
description: How the Vercel deployment serves the static site and the existing Express API from the monorepo root without a second backend or database.
---

The Vercel project must use the monorepo root as its Root Directory. Root-level `api/` serverless entrypoints reuse the existing Express application and its Neon PostgreSQL connection; do not recreate API routes or databases for Vercel.

**Why:** A frontend-only Root Directory makes Vercel compile function entries with the SPA's `noEmit` TypeScript config and leaves backend imports outside the project boundary. Vercel's Node runtime also does not support TypeScript project references. A blanket SPA rewrite otherwise sends `/api/*` to the frontend document, causing data endpoints such as vehicle inventory to return HTML instead of JSON.

**How to apply:** Keep the root TypeScript config free of project references and include the root function entries plus the session type augmentation. Build the Vite site to its existing nested output directory, and keep filesystem routing ahead of the SPA fallback so functions resolve first while browser routes still serve the frontend entry document. Production requires the existing `DATABASE_URL` and `SESSION_SECRET` values.