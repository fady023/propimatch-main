# Propimatch

A modern, mobile-first real estate app (web + API) with Supabase for auth/db/storage.

## Monorepo layout
- `apps/web` – React (Vite) frontend
- `apps/server` – Fastify TypeScript API
- `packages/types` – shared TypeScript types
- `packages/data` – demo data used by web/server
- `supabase/` – SQL schema + seed for PostgreSQL (Supabase)

## Prerequisites
- Node.js 18+ (recommend 20)
- npm 9+
- Git
- Optional: Supabase CLI for local DB

## Quick start (local)
```bash
# 1) Install deps (monorepo)
npm install

# 2) Typecheck/build shared packages (if needed)
npm run typecheck

# 3) Start API (one terminal)
npm run dev:server
# API on http://localhost:4000

# 4) Start web (another terminal)
# Vite port configured in apps/web/vite.config.ts (strict port)
npm run dev:web
# Frontend on http://127.0.0.1:5175 (or configured port)
```

### Environment variables
Create `apps/web/.env` with:
```env
# Supabase (optional for local; app falls back to mock if missing/invalid)
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>

# Backend base URL (defaults to http://<host>:4000)
VITE_API_BASE_URL=https://your-api.example.com

# Force mock auth (optional for local only)
VITE_AUTH_MODE=mock
```

Create `apps/server/.env` if you add server-side secrets (none required for demo).

## Supabase database (schema + seed)
```bash
# Install CLI: https://supabase.com/docs/guides/cli
supabase login
cd supabase
# Link to your project (copy ref from Supabase Settings → General)
supabase link --project-ref <project-ref>

# Local dev DB (recommended first)
supabase start
supabase db reset

# Seed demo data (assumes two auth users exist: aisha@example.com, omar@example.com)
supabase db execute --file ./seed.sql
```

## Deploy
### Frontend (Vercel recommended)
- Project root: `apps/web`
- Build: `npm ci && npm run build`
- Output: `dist`
- Env vars:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_API_BASE_URL` → your API URL

### API (Render or Fly.io)
- Root: `apps/server`
- Node 20
- Build: `npm ci`
- Start: `npx tsx src/index.ts` (or use the workspace start script)
- Health check: `/health`
- Env vars:
  - `PORT` (platform provided)
  - `CORS_ORIGIN` (optional) set to your frontend URL

### Supabase
- Use hosted project
- Add frontend URLs to Auth → URL configuration (redirects)

## Troubleshooting
- Frontend blank screen: check browser console; ensure CSS `:root` variables and envs.
- Supabase errors: verify DNS/URL, set mock auth via `VITE_AUTH_MODE=mock` to continue offline.
- API not reachable: ensure server is running on port 4000 and CORS allows your frontend origin.

## License
Private. All rights reserved.


