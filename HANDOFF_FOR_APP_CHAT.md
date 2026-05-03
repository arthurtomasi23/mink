# Handoff for the Mink **iOS app** Cursor chat

This document covers two things the web/landing/dashboard work changed
that the mobile app needs to know about:

1. **Database changes** that were applied to your Supabase project.
2. **PostHog analytics** — how to add it to the app so events show up in
   the same project the dashboard reads from.

Everything below is copy-paste ready. Nothing here breaks anything that
already exists in the iOS app — Apple Sign In, profile rows, etc. all
keep working.

---

## 1. Supabase database changes

> Migration source of truth (already applied):
> `supabase/migrations/20260503140000_admin_and_waitlist.sql`

### 1.1 `profiles.role` now allows `'admin'`

The existing `CHECK` constraint on `profiles.role` previously allowed
`('user', 'artist')`. It was dropped and re-added so the allowed values
are now:

```
'user' | 'artist' | 'admin'
```

**App impact:** none, unless you have client-side validation that hard-codes
the allowed role values — if so, add `'admin'` to the union. The default
for new users (`'user'`) is unchanged. Apps should still **never** let a
client write `role = 'admin'` (RLS now blocks self-promotion anyway, see
1.4).

### 1.2 New `public.is_admin(uid uuid default auth.uid())` function

A `SECURITY DEFINER` SQL function that returns `true` if the given user
(default: the current auth user) has `profiles.role = 'admin'`.

Used by every admin RLS policy. The app shouldn't need to call it
directly, but it's safe to: `supabase.rpc('is_admin')` returns a boolean.

### 1.3 New `public.waitlist` table

Holds landing-page sign-ups. The app does **not** read or write this —
it's owned by the marketing site. Schema (FYI only):

```sql
create table public.waitlist (
  id           uuid primary key default gen_random_uuid(),
  role         public.waitlist_role not null,   -- enum: 'seeker' | 'artist'
  email        text not null,
  name         text,
  city         text,
  instagram    text,
  artist_spot  int,                              -- 1..N for founding 100
  ip           text,
  user_agent   text,
  source       text,                             -- e.g. 'landing'
  created_at   timestamptz not null default now()
);
-- unique on (lower(email), role)
```

RLS: only admins can read/write. The waitlist API on the web uses the
service-role key (never exposed to clients).

### 1.4 New `public.admin_audit_log` table

Records every admin action taken from the dashboard (invite admin,
demote admin, delete waitlist entry). Append-only from the app's POV.
RLS: admin-only select/insert. The app does not interact with this.

### 1.5 Row-Level Security on `profiles`

RLS is **now enabled** on `public.profiles`. Policies installed:

| Policy                  | Op     | Who                               |
| ----------------------- | ------ | --------------------------------- |
| `profiles_select_self`  | SELECT | the row owner                     |
| `profiles_select_admin` | SELECT | admins (read all rows)            |
| `profiles_update_self`  | UPDATE | owner, but **role is locked**     |
| `profiles_update_admin` | UPDATE | admins (can change anyone's role) |

**App impact — read carefully:**

- **Reading your own profile:** unchanged. `select * from profiles where id = auth.uid()` works as before.
- **Reading other users' profiles:** if your app ever did `select * from profiles` and assumed it would get other users (e.g. for an explore/discover feed), it now returns **only the current user's row** unless that user is an admin. If you need a public-readable subset, add a dedicated SELECT policy or a view (e.g. `create policy profiles_public_read on profiles for select using (true)` — but think about whether you want emails/coords visible to everyone first; you probably don't).
- **Updating your own profile:** still works, with one constraint — the `with check` clause forces `role` to remain whatever it currently is. Existing app code that does `update profiles set name='…', bio='…'` is fine because it doesn't touch `role`. If your app explicitly sends `role` in an update payload, **strip it** before calling Supabase.
- **No INSERT policy on `profiles`:** if your app relied on the *user* (anon/authenticated key) inserting their own profile row, it's now blocked. Two clean fixes:
  1. (Recommended, what most apps do) Use a `handle_new_user` trigger on `auth.users` that auto-creates the `profiles` row server-side. If you already have one, you're done.
  2. Add a self-insert policy:
     ```sql
     create policy profiles_insert_self
       on public.profiles for insert
       with check (id = auth.uid());
     ```

### 1.6 Admin password flow (for the dashboard)

When you (or any future admin) is given dashboard access, a password is
set on their Supabase auth user. **This does not break Apple Sign In** —
Supabase keeps OAuth identities and the password as separate sign-in
methods on the same user. The app's Apple flow is untouched.

You set your own initial password directly in SQL:

```sql
update auth.users
   set encrypted_password = crypt('YOUR-NEW-PASSWORD', gen_salt('bf')),
       email_confirmed_at = coalesce(email_confirmed_at, now()),
       updated_at         = now()
 where id = '0724a1d9-902a-443b-bac7-103938006bc8';
```

Future admins are provisioned from the dashboard's `/dashboard/admins`
page; the dashboard generates an 18-char password and shows it once.

### 1.7 What the app should do — checklist

- [ ] If you hard-code `role` values somewhere, add `'admin'`.
- [ ] If you do `update profiles set role = …`, remove that — it will be rejected by RLS for non-admins.
- [ ] If you read other users' profile rows, add a dedicated `profiles` SELECT policy or a public view; default RLS only returns the current user.
- [ ] If profile rows are created client-side, either add a `handle_new_user` trigger or add the `profiles_insert_self` policy above.
- [ ] Nothing else changes. `auth`, sessions, and Apple Sign In are unaffected.

---

## 2. PostHog integration for the app

The dashboard at `/dashboard/analytics` is wired to a PostHog project.
Adding PostHog to the iOS app means **product events from the app appear
in the same dashboards** alongside web events, and you can build funnels
that span web → install → in-app behaviour.

### 2.1 Project keys

Use the **same project** as the web. In Vercel you'll find:

```
NEXT_PUBLIC_POSTHOG_KEY     = phc_…    (public, safe to ship in clients)
NEXT_PUBLIC_POSTHOG_HOST    = https://eu.i.posthog.com   (or us.i.posthog.com)
```

Use the same `phc_…` key in the app. Use the EU host if your project is
on EU; otherwise US. Never ship the personal API key (`phx_…`) to a
client.

### 2.2 SDK install — Swift / SwiftUI

Add via Swift Package Manager:

```
https://github.com/PostHog/posthog-ios.git
```

In your `App` entrypoint:

```swift
import SwiftUI
import PostHog

@main
struct MinkApp: App {
    init() {
        let config = PostHogConfig(
            apiKey: "phc_YOUR_PUBLIC_KEY",
            host: "https://eu.i.posthog.com" // match your project region
        )
        config.captureApplicationLifecycleEvents = true
        config.captureScreenViews = true
        config.sessionReplay = false // flip on later if you want
        PostHogSDK.shared.setup(config)
    }

    var body: some Scene {
        WindowGroup { RootView() }
    }
}
```

### 2.2.1 SDK install — React Native (skip if native iOS)

```bash
npm i posthog-react-native
```

```ts
import PostHog from 'posthog-react-native'

export const posthog = new PostHog(
  process.env.EXPO_PUBLIC_POSTHOG_KEY!,
  { host: process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com' }
)
```

Wrap your root in `<PostHogProvider client={posthog}>`.

### 2.3 Identify users so web + app sessions merge

The single most important call. Do it **right after** Supabase finishes
sign-in (Apple, Google, magic link, password — any of them). Use the
Supabase user id as the distinct id. That id is also what the dashboard
joins on, so your funnels span devices.

**Swift:**

```swift
import PostHog
import Supabase

func onAuthSignedIn(user: User) {
    PostHogSDK.shared.identify(
        user.id.uuidString,
        userProperties: [
            "email": user.email ?? "",
            "auth_provider": user.appMetadata["provider"] as? String ?? "unknown"
        ]
    )
}
```

On sign-out:

```swift
PostHogSDK.shared.reset()
```

**React Native:**

```ts
posthog.identify(user.id, {
  email: user.email,
  auth_provider: user.app_metadata?.provider ?? 'unknown',
})
// on sign-out
posthog.reset()
```

### 2.4 Mirror these event names from the web

The web already emits `waitlist_joined`. Use the **same snake_case
naming convention** in the app so the Insights UI groups them sensibly.
Suggested first set:

| Event                | When to fire                                                             | Properties                                           |
| -------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------- |
| `app_opened`         | App launch (PostHog autocaptures `Application Opened` if lifecycle is on) | —                                                    |
| `signup_started`     | User taps Apple / Google / Email sign-up button                          | `method`                                             |
| `signup_completed`   | Supabase returns a session for the first time                            | `method`, `is_artist`                                |
| `profile_completed`  | User finishes the onboarding profile flow                                | `has_avatar`, `style_count`, `city`                  |
| `tattoo_searched`    | User runs a search                                                       | `query`, `style`, `radius_km`                        |
| `artist_viewed`      | User opens an artist's profile                                           | `artist_id`                                          |
| `appointment_request_sent` | User submits a booking/inquiry                                       | `artist_id`, `style`                                 |
| `subscription_started`     | (Artist) starts a paid plan                                          | `plan`, `is_founding` (for the first-100 cohort)     |

Capture example (Swift):

```swift
PostHogSDK.shared.capture("artist_viewed", properties: [
    "artist_id": artist.id.uuidString,
    "from": "search_results"
])
```

### 2.5 Privacy / App Store

PostHog is allowed in App Store apps as long as:

- You disclose it in your **App Privacy** answers (data linked to user:
  identifiers, usage data; not used for tracking across third-party apps).
- You honour **App Tracking Transparency** if you ever cross-link with
  third-party data — for first-party analytics like this, ATT is **not
  required**. Don't call `requestTrackingAuthorization` for PostHog
  alone.
- You add a `Privacy Manifest` (`PrivacyInfo.xcprivacy`) and declare the
  required-reason APIs PostHog uses. The PostHog iOS SDK ships its own
  manifest; you only need to ensure it's bundled (SPM does this
  automatically).
- Mention PostHog by name in your privacy policy (the web already does:
  `/privacy`). Use the same wording in your in-app policy or link to
  `https://mink.app/privacy`.

### 2.6 Cookie / consent parity with the web

The web only initialises PostHog **after** the user accepts analytics in
the cookie banner. The iOS app doesn't need a cookie banner, but if you
want the same opt-in semantics:

```swift
// Pause until the user has accepted in onboarding/settings
PostHogSDK.shared.optOut()

// Later, when they accept:
PostHogSDK.shared.optIn()
```

If you want analytics on by default for the app (typical), skip this and
just rely on the Privacy disclosure.

### 2.7 Verifying it's wired up

1. Build & run the app on a device/simulator.
2. Sign in with your account.
3. In PostHog → **Activity** → look for `$identify` and `app_opened` from your `distinct_id` (your Supabase user id).
4. Open `/dashboard/analytics` on the web — same project, you should see live events.

---

## 3. Files in this repo that informed the above

For reference if the other chat needs to inspect anything:

- `supabase/migrations/20260503140000_admin_and_waitlist.sql` — the only
  DB migration applied for this work. Idempotent.
- `src/lib/posthog/server.ts` — server-side capture helper used by the
  waitlist API.
- `src/components/PostHogProvider.tsx` — how the web initialises PostHog
  *after* consent (good reference for the consent-aware pattern).
- `src/app/api/waitlist/route.ts` — the only place that emits
  `waitlist_joined`; the app should use the same event name if it ever
  gates re-engagement on waitlist sign-ups.

That's everything. The app shouldn't need any other changes from the
work that was done on the landing page + dashboard.
