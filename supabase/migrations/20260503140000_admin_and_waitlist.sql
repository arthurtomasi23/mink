-- =====================================================================
-- Mink — admin role + waitlist table + secure RLS
--
-- Tailored to YOUR existing schema:
--   public.profiles already has columns:
--     id, name, avatar_url, role, city, bio, studio_name, studio_address,
--     instagram, tiktok, website, created_at, updated_at,
--     preferred_styles, latitude, longitude
--   profiles.role is the source of truth ('user' | 'admin').
--
-- Safe to run more than once — every statement uses
-- `if not exists` / `create or replace`. It does NOT modify any
-- existing profiles columns or rows.
--
-- Apply via:  Supabase Dashboard → SQL Editor → New query → paste → Run
--      OR :  supabase db push   (if you use the Supabase CLI)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Widen profiles.role to allow 'admin'.
--    Your existing CHECK constraint allows ('user', 'artist'). We add
--    'admin' without losing the other valid values.
-- ---------------------------------------------------------------------
do $$
declare
  con_name text;
begin
  select c.conname
    into con_name
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
   where n.nspname = 'public'
     and t.relname = 'profiles'
     and c.contype = 'c'
     and pg_get_constraintdef(c.oid) ilike '%role%';

  if con_name is not null then
    execute format('alter table public.profiles drop constraint %I', con_name);
  end if;

  alter table public.profiles
    add constraint profiles_role_check
    check (role in ('user', 'artist', 'admin'));
end$$;

-- ---------------------------------------------------------------------
-- 1. is_admin() — single source of truth used by every RLS policy
--    and by the Next.js middleware. SECURITY DEFINER lets it read
--    profiles regardless of the caller's RLS scope.
-- ---------------------------------------------------------------------
create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = uid),
    false
  );
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to authenticated, anon;

-- ---------------------------------------------------------------------
-- 2. waitlist — landing-page email captures
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'waitlist_role') then
    create type public.waitlist_role as enum ('seeker', 'artist');
  end if;
end$$;

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  role public.waitlist_role not null,
  email text not null,
  name text,
  city text,
  instagram text,
  artist_spot int,
  ip text,
  user_agent text,
  source text,
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_email_role_idx
  on public.waitlist (lower(email), role);

create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);

-- ---------------------------------------------------------------------
-- 3. admin_audit_log — every admin action is recorded
-- ---------------------------------------------------------------------
create table if not exists public.admin_audit_log (
  id bigserial primary key,
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  action text not null,
  target_id uuid,
  target_email text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_log_created_at_idx
  on public.admin_audit_log (created_at desc);

-- ---------------------------------------------------------------------
-- 4. Row-Level Security
--    Default deny. The service-role key (used only by trusted server
--    code) bypasses RLS so the public waitlist API can still insert.
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.waitlist enable row level security;
alter table public.admin_audit_log enable row level security;

-- profiles policies ----------------------------------------------------
-- Users can read their own row; admins can read all.
drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self
  on public.profiles for select
  using (id = auth.uid());

drop policy if exists profiles_select_admin on public.profiles;
create policy profiles_select_admin
  on public.profiles for select
  using (public.is_admin());

-- A user can update their own row, but CANNOT change their own role
-- (no self-promotion to admin).
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self
  on public.profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.profiles where id = auth.uid())
  );

-- Admins can update anyone (including roles).
drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- waitlist policies ----------------------------------------------------
drop policy if exists waitlist_admin_all on public.waitlist;
create policy waitlist_admin_all
  on public.waitlist for all
  using (public.is_admin())
  with check (public.is_admin());

-- audit log policies ---------------------------------------------------
drop policy if exists audit_admin_select on public.admin_audit_log;
create policy audit_admin_select
  on public.admin_audit_log for select
  using (public.is_admin());

drop policy if exists audit_admin_insert on public.admin_audit_log;
create policy audit_admin_insert
  on public.admin_audit_log for insert
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 5. Promote the FIRST admin (you).
--    Replace the email below with yours, then run this once.
-- ---------------------------------------------------------------------
-- update public.profiles
--    set role = 'admin'
--  where id = (select id from auth.users where email = 'arthur.tomasi@gmx.de');
