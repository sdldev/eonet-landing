# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`eonet-landing` is the public-facing EONET website: marketing landing page, customer self-service, public payment page (`/pay/:token`), and customer registration. Built with Astro 6 SSR on `@astrojs/node` standalone adapter, deployed as a Docker container.

## Commands

```bash
npm install
cp .env.example .env
npm run dev          # localhost:4321
npm run build        # → dist/
npm run preview      # preview production build
```

No typecheck or test script defined. Use `npm run build` as verification (Astro checks types during build).

## Architecture

- **SSR**: `output: 'server'` with `@astrojs/node` in standalone mode. Pages are server-rendered on each request.
- **No frontend framework**: Pure Astro components (`.astro`). No Vue, React, or other UI framework.
- **API calls**: Pages/components fetch from billing API via `import.meta.env.PUBLIC_API_BASE`. All endpoints used must be **public/unauthenticated** token-based endpoints only.
- **Public payment flow**: `/pay/[token]` → `GET /v1/public/invoice/:token` → Midtrans Snap popup → webhook settles payment.
- **Customer registration**: `/register/` → form submission to billing API.

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `PUBLIC_API_BASE` | Billing API base URL (no trailing slash) | `http://localhost:3000` |
| `PUBLIC_MIDTRANS_CLIENT_KEY` | Midtrans Snap client key | — |
| `PUBLIC_MIDTRANS_IS_PRODUCTION` | `"true"` for production Midtrans | `"false"` |
| `PUBLIC_WA_NUMBER` | WhatsApp contact number (E.164, no +) | — |
| `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile CAPTCHA key (optional) | — |

All variables are `PUBLIC_*` (exposed to client). Never put secrets here.

## Routes

```
src/pages/
├─ index.astro              # Marketing landing page
├─ customer.astro           # Customer self-service
├─ pay/
│  ├─ [token].astro         # Public invoice payment (unauthenticated)
│  └─ finish.astro          # Payment result redirect
└─ register/
   ├─ index.astro           # Customer registration form
   └─ success.astro         # Registration success page
```

## Docker

Multi-stage build: `node:22-alpine` build stage → `node:22-alpine` runtime. Runs `node dist/server/entry.mjs` on port 4321.

```bash
docker build -t eonet-landing .
docker run -p 4321:4321 eonet-landing
```

## Key Constraints

- **Public only**: This repo must never use authenticated endpoints. All API calls use public token endpoints (`/v1/public/*`).
- **No business logic**: Installation fee, prorate, invoice calculations come from API. Display only.
- **No Tailwind/PostCSS**: Plain CSS in `src/styles/global.css`.
- **Astro components only**: No `.vue`, `.tsx`, or `.jsx` files. Use `.astro` for pages/components.

## Documentation

- `README.md` — quick start (boilerplate, may need updating).
- Workspace contracts: `../docs/CROSS_REPO_CONTRACTS.md`.
- Billing API public endpoints: `../eonet-billing-api/docs/API_MVP.md`.
