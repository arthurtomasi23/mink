# Dashboard admin provisioning (handoff doc)

Give this doc to whoever maintains the landing page / Next.js dashboard. It assumes the Supabase migrations from the mobile app repo are applied (especially `decouple_admin_from_role`).

---

## What changed in Supabase

- **`profiles.role`** is only **user-facing** in the mobile app: `'user'` (seeker) or `'artist'`. Admin is **not** “who you are in the app” anymore.
- **`profiles.is_admin`** is a **`boolean`** for **dashboard privilege**. One person can be `role='user'` (or `'artist'`) **and** `is_admin=true` so they use the **app normally** and still open **`/dashboard`**.
- **`public.is_admin(uid)`** returns `true` if `profiles.is_admin` **or** (legacy) `profiles.role='admin'` so old data and old dashboard code keep working until you migrate fully.
- **`set_initial_role('user'|'artist')`** updates only `profiles.role`; it does **not** touch `is_admin`.

Migrations live in this repo:

- `supabase/migrations/20260504190000_relax_set_initial_role.sql`
- `supabase/migrations/20260504195000_decouple_admin_from_role.sql`

---

## Add a **new** person as admin + give them login email/password

### Step 1 — Create the auth user (pick one)

**Recommended — Supabase Dashboard**

1. Open **Authentication → Users**.
2. **Add user** (or **Invite**), set:
   - **Email** — the address they’ll use on `/dashboard` (their real inbox, **not** a fake domain unless you’ll never receive confirmations).
   - **Password** — strong password you share once securely.
3. Optionally **Auto-confirm email** if the Dashboard offers it, so they can sign in immediately.

**Alternative — Dashboard app using service role**  
If your Next.js app already has server code that calls `supabase.auth.admin.createUser()`, use that pattern instead of manual SQL—same outcome: row in `auth.users` with known email/password.

### Step 2 — Ensure they have a `profiles` row

Many projects auto-create `public.profiles` when `auth.users` is inserted (`handle_new_user` trigger).

- If a row exists: continue.
- If **no row**: insert one (adjust columns to match your `profiles` table):

```sql
insert into public.profiles (id, name, role, is_admin)
values (
  '<THEIR_AUTH_USERS_ID_UUID>',
  'Their Display Name',
  'user',
  false
);
```

They can stay `'user'` for app behaviour; `'artist'` if you want artist UI by default.

### Step 3 — Grant dashboard admin

```sql
update public.profiles
   set is_admin = true
 where id = '<THEIR_AUTH_USERS_ID_UUID>';
```

### Step 4 — Verify

```sql
select u.id,
       u.email,
       p.role,
       p.is_admin,
       public.is_admin(u.id) as is_admin_fn
  from auth.users u
  left join public.profiles p on p.id = u.id
 where u.id = '<THEIR_AUTH_USERS_ID_UUID>';
```

Expect: `is_admin = true`, `is_admin_fn = true`.

---

## Existing user (e.g. Apple on mobile) → add **dashboard email + password** + admin

Their `auth.users` row already exists. Keep the same UUID so Apple sign-in stays on the **same account**.

### Set or change dashboard email + password + confirm email

```sql
create extension if not exists pgcrypto;

update auth.users
   set email              = 'them@their-domain.com',
       encrypted_password = crypt('YOUR-STRONG-PASSWORD', gen_salt('bf')),
       email_confirmed_at = coalesce(email_confirmed_at, now()),
       updated_at         = now()
 where id = '<THEIR_UUID>';
```

Replace credentials; don’t paste real passwords back into chats.

Then:

```sql
update public.profiles
   set is_admin = true
 where id = '<THEIR_UUID>';
```

Apple sign-in on the phone still ties to `auth.identities`; this only adds **email/password** as a second login method.

---

## Your own admin + password reminder (reuse)

```sql
create extension if not exists pgcrypto;

update public.profiles
   set is_admin = true
 where id = '<YOUR_UUID>';

update auth.users
   set encrypted_password = crypt('YOUR-NEW-PASSWORD', gen_salt('bf')),
       email_confirmed_at = coalesce(email_confirmed_at, now()),
       updated_at         = now()
 where id = '<YOUR_UUID>';
```

They log into **`/dashboard`** with the **`auth.users.email`** you set plus that password.

---

## Optional: revoke admin safely

Does **not** delete their account:

```sql
update public.profiles
   set is_admin = false
 where id = '<THEIR_UUID>';
```

If you still rely on **`role='admin'`** somewhere (legacy), also clear it:

```sql
update public.profiles
   set role = coalesce(role, 'user'), is_admin = false
 where role = 'admin';  -- migrate legacy role-only admins if needed
```

(After the mobile migration, prefer `is_admin` only and keep `role` as `user`|`artist`.)

---

## Next.js `/dashboard` app (this repo)

The landing-page dashboard is aligned with `public.is_admin(uid)`:

- **Sign-in** allows access when `is_admin()` is true (`profiles.is_admin` **or** legacy `role='admin'`).
- **Invite admin** sets `profiles.is_admin = true`, keeps `role` as `user` or `artist` (does **not** set `role='admin'`). New profiles are inserted with `role: 'user'` and `is_admin: true`.
- **Demote** sets `is_admin: false` and, if `role` was still `'admin'` (legacy), sets `role` to `'user'`.
- **Overview “Admins” count** and the **Admins** list use `is_admin = true OR role = 'admin'`.

Run `npm run db:check` (see `scripts/check-readiness.mjs`) to verify `profiles.is_admin`, `is_admin()`, waitlist, and audit log.

---

## Troubleshooting: sign-in works on **localhost** but not on **Vercel**

1. **Production uses a different Supabase project than `.env.local`.**  
   In Vercel → Settings → Environment Variables, confirm **`NEXT_PUBLIC_SUPABASE_URL`** and **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** match your local `.env.local` exactly (same project ref in the hostname). Compare with this endpoint (hostname only — no secrets):
   - Local: http://localhost:3000/api/health/auth  
   - Prod: https://www.mink-app.de/api/health/auth  
   **`supabaseHost` must match** if you’re testing the same user/password.

2. **`www` vs apex.** If you browse `https://www.mink-app.de` but bookmarks or redirects bounce to `https://mink-app.de` (or vice versa), auth cookies stay on **one hostname** unless scoped. Fix by choosing a **canonical** host on Vercel (redirect apex → www or the reverse).  
   Optionally set **`AUTH_COOKIE_DOMAIN=.mink-app.de`** (leading dot, no `www`) in Vercel so session cookies apply to **all** subdomains of `mink-app.de`. Omit on localhost.

3. **Supabase Auth URL allow list.** Dashboard → Authentication → URL configuration: **Site URL** should be your canonical public URL. Add **`https://www.mink-app.de/**`** (and apex if needed) under **Redirect URLs** so OAuth and deep links behave; password sign-in is less picky but stays aligned.

4. **Deployed build must include SSR cookie/cache fix.** The Next.js middleware must apply the **second argument** Supabase `@supabase/ssr` passes to `setAll` (Cache-Control on auth responses); without it some edge setups misbehave. This repo wires that correctly — redeploy latest `main`.
