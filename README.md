# Mink — landing page + admin dashboard

A Next.js 15 app for **Mink**, the tattoo discovery app. Includes:

- A modern, animated **public landing page** (hero, value props,
  image-search demo, how-it-works, artists section, pricing, waitlist,
  FAQ, footer) with a GDPR-style cookie consent banner.
- A **secure admin dashboard** at `/dashboard` (overview, waitlist,
  app users, admin management, PostHog analytics).
- A **waitlist API** that writes directly to your Supabase database.
- **Privacy / Cookies / Terms** pages compliant with the Apple App
  Store Review Guidelines (incl. §5.1) and major privacy laws.
- **PostHog** analytics on the web + ready-to-share project for your
  Expo iOS app.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- Supabase (auth, postgres, RLS) via `@supabase/ssr`
- PostHog (web + Expo)

## 1. Configure environment

```bash
cp .env.example .env.local
```

Fill in:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, never prefix with
  `NEXT_PUBLIC_`)
- `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` (optional
  but recommended)

Never put real secrets in `.env.example` — that file is committed.

## 2. Apply the database migration

The migration is **idempotent** and **does not modify your existing
`profiles` table**. It only:

- Creates an `is_admin()` SECURITY DEFINER function that returns
  `profiles.role = 'admin'`.
- Creates `public.waitlist` (with a unique `(lower(email), role)`
  index) and `public.admin_audit_log`.
- Enables RLS on `profiles`, `waitlist` and `admin_audit_log` with
  policies that only allow admins to read sensitive data.

```bash
npm run db:check    # tells you exactly what's missing
```

If it reports missing items, open your Supabase SQL editor:

```
https://supabase.com/dashboard/project/<your-project-ref>/sql/new
```

Paste and run:

```
supabase/migrations/20260503140000_admin_and_waitlist.sql
```

Then promote yourself to admin in the same SQL editor:

```sql
update public.profiles
   set role = 'admin'
 where id = (select id from auth.users where email = 'you@example.com');
```

Run `npm run db:check` again to confirm everything is green.

## 3. Install + run

```bash
npm install
npm run dev          # http://localhost:3000
```

Then sign in at `http://localhost:3000/dashboard/login` with the
email + password of the Supabase Auth user you just promoted.

## Where things live

| Path | What it is |
| --- | --- |
| `src/app/page.tsx` | Public landing page |
| `src/app/(privacy|cookies|terms)/page.tsx` | Legal pages |
| `src/app/api/waitlist/route.ts` | Public waitlist endpoint (writes to Supabase, falls back to a JSON file if Supabase env vars are missing) |
| `src/app/dashboard/login/...` | Sign-in (server action, brute-force lockout, admin role check) |
| `src/app/dashboard/(panel)/...` | The admin shell — every page is admin-gated by middleware AND by the layout |
| `src/middleware.ts` | Edge auth refresh + dashboard protection |
| `src/lib/supabase/{browser,server,admin,middleware}.ts` | Three differently-scoped Supabase clients |
| `src/lib/supabase/queries.ts` | All read queries used by the dashboard |
| `src/lib/posthog/server.ts` | Server-side PostHog capture |
| `src/components/PostHogProvider.tsx` | Client provider — only initializes after analytics consent |
| `supabase/migrations/...sql` | The DB migration |
| `scripts/check-readiness.mjs` | `npm run db:check` |
| `scripts/inspect-schema.mjs` | `npm run db:inspect` (deeper introspection) |

## Security model

- **`profiles.role`** is the only place admin status lives. Users
  cannot escalate themselves: the RLS update policy explicitly forbids
  changing your own `role`.
- **`is_admin()`** is `SECURITY DEFINER` so RLS can use it without
  recursion. Only `authenticated` and `anon` roles can call it; the
  service role bypasses RLS entirely.
- The Next.js **middleware** blocks `/dashboard/*` at the edge for
  non-admins. The dashboard **layout** double-checks via
  `getAdminUser()` on every render — defense in depth.
- The **service role key** is only ever read server-side
  (`import "server-only"` will fail the build if anyone tries to
  import it from the client).
- All admin actions (invite, demote, delete waitlist entry) are
  recorded in `public.admin_audit_log` with actor + IP + UA.
- Login form has a **5-attempt / 15-minute** rate limit per
  `(IP, email)`.
- Sign in with an account whose `role != 'admin'` is silently rejected
  (no UI hint that admin sign-in even exists).

## Replacing placeholder images

Every image on the public landing page is rendered through
`<ImagePlaceholder />` (`src/components/ImagePlaceholder.tsx`).
Replace each call with a `next/image` `<Image>` keeping the same
`ratio` and `radius`. Common spots: `Hero`, `Features` (image-search
showcase), `HowItWorks`, `ForArtists`.

## Adding PostHog to your Expo app

Install `posthog-react-native` in your Expo project, then initialize
it with the **same** `NEXT_PUBLIC_POSTHOG_KEY` and
`NEXT_PUBLIC_POSTHOG_HOST` you set here. Identify users with their
Supabase `auth.users.id` (`distinct_id`) so events from web and iOS
join into one user.
