---
name: Vercel API routing
description: How the Vercel deployment serves the static site and the existing Express API from the monorepo root without a second backend or database.
---

The Vercel project must use the monorepo root as its Root Directory. Root-level `api/` serverless entrypoints reuse the existing Express application and its Neon PostgreSQL connection; do not recreate API routes or databases for Vercel.

**Why:** A frontend-only Root Directory makes Vercel compile function entries with the SPA's `noEmit` TypeScript config and leaves backend imports outside the project boundary. Vercel's Node runtime also does not support TypeScript project references. The legacy `routes` override can bypass automatic Function routing, while a blanket SPA rewrite sends `/api/*` to the frontend document and causes data endpoints such as vehicle inventory to return HTML instead of JSON.

**How to apply:** Keep the root TypeScript config free of project references and include the root function entries plus the session type augmentation. Build the Vite site to its existing nested output directory. Do not use a legacy `routes` override; use a single SPA rewrite whose pattern excludes `/api` and `/api/*`, leaving root-level Functions to Vercel's automatic filesystem routing. Production requires the existing `DATABASE_URL` and `SESSION_SECRET` values.