/**
 * Hand-rolled types for the rows this app reads/writes.
 *
 * We intentionally do NOT plug these into a `Database` generic on the
 * Supabase client — the generated `Database` type is the only shape
 * Supabase's strict generics fully accept. Instead we cast query
 * results to these types at the call site, which keeps app code
 * statically typed without fighting the SDK.
 *
 * Run `npx supabase gen types typescript --project-id YOUR-REF`
 * later to replace these with generated types.
 */

export type WaitlistRole = "seeker" | "artist";

/** App-facing role only: `user` | `artist`. Legacy `admin` may still exist on old rows. */
export type AppRole = "user" | "artist" | "admin" | (string & {});

export interface WaitlistRow {
  id: string;
  role: WaitlistRole;
  email: string;
  name: string | null;
  city: string | null;
  instagram: string | null;
  artist_spot: number | null;
  ip: string | null;
  user_agent: string | null;
  source: string | null;
  created_at: string;
}

export interface WaitlistInsert {
  role: WaitlistRole;
  email: string;
  name?: string | null;
  city?: string | null;
  instagram?: string | null;
  artist_spot?: number | null;
  ip?: string | null;
  user_agent?: string | null;
  source?: string | null;
}

/**
 * The shape of public.profiles in this project. Mirrors the live
 * schema (see scripts/inspect-schema.mjs output).
 */
export interface ProfileRow {
  id: string;
  name: string | null;
  avatar_url: string | null;
  /** App persona: seeker vs artist. Dashboard access is `is_admin`, not this field. */
  role: AppRole;
  /** When true, user may sign into /dashboard (see public.is_admin()). */
  is_admin?: boolean | null;
  city: string | null;
  bio: string | null;
  studio_name: string | null;
  studio_address: string | null;
  instagram: string | null;
  tiktok: string | null;
  website: string | null;
  preferred_styles: string[] | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  role?: AppRole;
  name?: string | null;
  is_admin?: boolean;
}

export interface AuditLogRow {
  id: number;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  target_id: string | null;
  target_email: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface AuditLogInsert {
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  target_id?: string | null;
  target_email?: string | null;
  metadata?: Record<string, unknown> | null;
}
