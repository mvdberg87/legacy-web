<!-- .github/copilot-instructions.md -->
# Quick instructions for AI coding agents

This repository is a Next.js (App Router) application using TypeScript, Supabase, and an opinionated small set of conventions.
Keep guidance short and actionable; below are the essential facts an agent needs to be immediately productive.

- Project root: `sponsorjobs-web/` (sources under `src/`)
- App router: pages and API route handlers live under `src/app/` (e.g. `src/app/api/*/route.ts`)
- Build & dev commands: use npm scripts from `package.json`:
  - `npm run dev` — development (uses turbopack)
  - `npm run build` — build (turbopack)
  - `npm run start` — production start

Key architecture and patterns
- TypeScript baseUrl is `src` and imports use the `@/...` alias. Example: `import { saveTrackEvent } from '@/lib/track'`.
- There are two Supabase clients:
  - `src/lib/supabaseClient.ts` — browser/public client; expects `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. It validates the URL and throws early if malformed.
  - `src/lib/supabaseServer.ts` — server-side client; uses `SUPABASE_SERVICE_ROLE_KEY` and should only be used in server runtime code.
- API route handlers are Next.js route handlers (Edge or Server). They use `NextResponse` and often declare `export const runtime = 'edge'`.
- Layouts can opt out of ISR/SSG issues by using `export const dynamic = 'force-dynamic'` (see `src/app/layout.tsx`).

Environment variables (must be present locally for relevant flows)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server-only; used by `supabaseServer`)

Conventions and gotchas to respect
- The repo intentionally ignores TypeScript and ESLint build errors in `next.config.ts` (see `ignoreDuringBuilds` and `ignoreBuildErrors`). Do not assume a green build means perfect lint/TS.
- `next dev` and `next build` are configured to use turbopack flags; mimic those scripts when testing locally.
- Use `NextResponse.json({ ok: true })` for API JSON success responses (common pattern in existing handlers).
- When adding server-side database access, prefer `getSupabaseServer()` and do not expose service role keys to the client.

Examples from codebase (for quick reference)
- Track endpoint: `src/app/api/track/route.ts` receives POST JSON and calls `saveTrackEvent` from `src/lib/track.ts`.
- Supabase client usage: `getSupabase()` logs debug info in non-production and validates `NEXT_PUBLIC_SUPABASE_URL`.

Useful files to inspect
- `package.json` — scripts & dependencies
- `next.config.ts`, `tsconfig.json` — important build/runtime flags and path alias
- `src/app/layout.tsx` — top-level layout and `dynamic` usage
- `src/lib/supabaseClient.ts`, `src/lib/supabaseServer.ts`, `src/lib/track.ts` — integration patterns

If you need more context
- Ask which runtime (edge/server) and whether the change must run client-side, server-side, or as an edge function.
- Ask for missing env values if a flow cannot be reproduced locally.

If this file should merge with an existing `.github/copilot-instructions.md`, prefer preserving any project-specific rules already present; otherwise favor the condensed summary above.

— end of guidance —
