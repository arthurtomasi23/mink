import "server-only";

import { getAdminSupabase } from "./admin";
import { DASHBOARD_ADMIN_OR } from "./dashboard-access";
import type {
  AuditLogRow,
  ProfileRow,
  WaitlistRole,
  WaitlistRow,
} from "./types";

const FOUNDING_CAP = 100;

// =====================================================================
// Public types
// =====================================================================
export type RecentSignup = Pick<
  WaitlistRow,
  "id" | "role" | "email" | "name" | "city" | "artist_spot" | "created_at"
>;

export type DashboardStats = {
  totals: {
    waitlistTotal: number;
    seekers: number;
    artists: number;
    artistsLast7d: number;
    seekersLast7d: number;
    waitlistLast7d: number;
    waitlistPrev7d: number;
    growthPct: number | null;
    appUsers: number;
    appUsersLast7d: number;
    foundingClaimed: number;
    foundingRemaining: number;
    admins: number;
  };
  perDay: { date: string; seeker: number; artist: number; total: number }[];
  recentSignups: RecentSignup[];
};

export type WaitlistFilter = {
  role?: WaitlistRole | "all";
  search?: string;
  limit?: number;
  offset?: number;
};

export type AdminProfile = {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  role: string;
  is_admin: boolean | null;
  created_at: string;
};

export type AppUserRow = {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  role: string;
  /** Dashboard access flag (new schema). */
  is_admin: boolean | null;
  city: string | null;
  studio_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
};

// =====================================================================
// Helpers
// =====================================================================
function startOfDayUTC(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

/**
 * Look up auth emails for a list of profile ids.
 * Uses the admin auth API; results are cached for the request.
 */
async function emailsForIds(ids: string[]): Promise<Map<string, string | null>> {
  const map = new Map<string, string | null>();
  if (ids.length === 0) return map;

  const supabase = getAdminSupabase();
  const wanted = new Set(ids);
  let page = 1;
  // List up to ~1k users (5 pages of 200) — plenty for the dashboard.
  while (page <= 5 && wanted.size > 0) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error || !data?.users?.length) break;
    for (const u of data.users) {
      if (wanted.has(u.id)) {
        map.set(u.id, u.email ?? null);
        wanted.delete(u.id);
      }
    }
    if (data.users.length < 200) break;
    page += 1;
  }
  return map;
}

async function lastSignInsForIds(ids: string[]) {
  const map = new Map<string, string | null>();
  if (ids.length === 0) return map;
  const supabase = getAdminSupabase();
  const wanted = new Set(ids);
  let page = 1;
  while (page <= 5 && wanted.size > 0) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error || !data?.users?.length) break;
    for (const u of data.users) {
      if (wanted.has(u.id)) {
        map.set(u.id, u.last_sign_in_at ?? null);
        wanted.delete(u.id);
      }
    }
    if (data.users.length < 200) break;
    page += 1;
  }
  return map;
}

// =====================================================================
// Queries
// =====================================================================
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getAdminSupabase();

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);

  const [
    waitlistTotalRes,
    seekersRes,
    artistsRes,
    seekersLast7Res,
    artistsLast7Res,
    waitlistLast7Res,
    waitlistPrev7Res,
    foundingClaimedRes,
    adminsRes,
    recentRes,
    seriesRes,
  ] = await Promise.all([
    supabase.from("waitlist").select("id", { count: "exact", head: true }),
    supabase
      .from("waitlist")
      .select("id", { count: "exact", head: true })
      .eq("role", "seeker"),
    supabase
      .from("waitlist")
      .select("id", { count: "exact", head: true })
      .eq("role", "artist"),
    supabase
      .from("waitlist")
      .select("id", { count: "exact", head: true })
      .eq("role", "seeker")
      .gte("created_at", sevenDaysAgo.toISOString()),
    supabase
      .from("waitlist")
      .select("id", { count: "exact", head: true })
      .eq("role", "artist")
      .gte("created_at", sevenDaysAgo.toISOString()),
    supabase
      .from("waitlist")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString()),
    supabase
      .from("waitlist")
      .select("id", { count: "exact", head: true })
      .gte("created_at", fourteenDaysAgo.toISOString())
      .lt("created_at", sevenDaysAgo.toISOString()),
    supabase
      .from("waitlist")
      .select("id", { count: "exact", head: true })
      .eq("role", "artist")
      .not("artist_spot", "is", null)
      .lte("artist_spot", FOUNDING_CAP),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .or(DASHBOARD_ADMIN_OR),
    supabase
      .from("waitlist")
      .select("id, role, email, name, city, artist_spot, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("waitlist")
      .select("role, created_at")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true })
      .limit(5000),
  ]);

  // App users — counted via the auth admin API.
  let appUsers = 0;
  let appUsersLast7d = 0;
  try {
    const list = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    const data = list.data as { total?: number } | undefined;
    appUsers = data?.total ?? 0;
    const { count: recent } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString());
    appUsersLast7d = recent ?? 0;
  } catch {
    appUsers = 0;
  }

  // Build per-day series for the last 30 days.
  const series = new Map<string, { seeker: number; artist: number }>();
  for (let i = 29; i >= 0; i--) {
    const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    series.set(isoDate(startOfDayUTC(day)), { seeker: 0, artist: 0 });
  }
  const seriesRows = (seriesRes.data ?? []) as {
    role: WaitlistRole;
    created_at: string;
  }[];
  for (const row of seriesRows) {
    const key = isoDate(startOfDayUTC(new Date(row.created_at)));
    const bucket = series.get(key);
    if (bucket) {
      if (row.role === "seeker") bucket.seeker += 1;
      else bucket.artist += 1;
    }
  }
  const perDay = Array.from(series.entries()).map(([date, b]) => ({
    date,
    seeker: b.seeker,
    artist: b.artist,
    total: b.seeker + b.artist,
  }));

  const last7 = waitlistLast7Res.count ?? 0;
  const prev7 = waitlistPrev7Res.count ?? 0;
  const growthPct =
    prev7 === 0
      ? last7 > 0
        ? 100
        : null
      : Math.round(((last7 - prev7) / prev7) * 100);

  const foundingClaimed = foundingClaimedRes.count ?? 0;

  return {
    totals: {
      waitlistTotal: waitlistTotalRes.count ?? 0,
      seekers: seekersRes.count ?? 0,
      artists: artistsRes.count ?? 0,
      seekersLast7d: seekersLast7Res.count ?? 0,
      artistsLast7d: artistsLast7Res.count ?? 0,
      waitlistLast7d: last7,
      waitlistPrev7d: prev7,
      growthPct,
      appUsers,
      appUsersLast7d,
      foundingClaimed,
      foundingRemaining: Math.max(0, FOUNDING_CAP - foundingClaimed),
      admins: adminsRes.count ?? 0,
    },
    perDay,
    recentSignups: (recentRes.data ?? []) as RecentSignup[],
  };
}

export async function getWaitlist(filter: WaitlistFilter = {}): Promise<{
  data: WaitlistRow[];
  count: number;
  error: { message: string } | null;
}> {
  const supabase = getAdminSupabase();
  const limit = Math.min(Math.max(filter.limit ?? 50, 1), 200);
  const offset = Math.max(filter.offset ?? 0, 0);

  let q = supabase
    .from("waitlist")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (filter.role && filter.role !== "all") q = q.eq("role", filter.role);
  if (filter.search && filter.search.trim().length > 0) {
    const s = filter.search.trim().replace(/[%]/g, "");
    q = q.or(
      `email.ilike.%${s}%,name.ilike.%${s}%,city.ilike.%${s}%,instagram.ilike.%${s}%`,
    );
  }
  const res = await q;
  return {
    data: (res.data ?? []) as WaitlistRow[],
    count: res.count ?? 0,
    error: res.error ? { message: res.error.message } : null,
  };
}

export async function getAdminProfiles(): Promise<AdminProfile[]> {
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, avatar_url, role, is_admin, created_at")
    .or(DASHBOARD_ADMIN_OR)
    .order("created_at", { ascending: true });
  if (error) throw error;

  const profiles = (data ?? []) as unknown as Array<
    Pick<
      ProfileRow,
      "id" | "name" | "avatar_url" | "role" | "created_at"
    > & { is_admin?: boolean | null }
  >;
  const emails = await emailsForIds(profiles.map((p) => p.id));

  return profiles.map((p) => ({
    id: p.id,
    name: p.name,
    avatar_url: p.avatar_url,
    role: p.role,
    is_admin: p.is_admin ?? null,
    created_at: p.created_at,
    email: emails.get(p.id) ?? null,
  }));
}

export async function getRecentAuditLog(
  limit = 25,
): Promise<AuditLogRow[]> {
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from("admin_audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as AuditLogRow[];
}

export async function getAppUsers(
  opts: { limit?: number; offset?: number } = {},
): Promise<{ rows: AppUserRow[]; count: number }> {
  const supabase = getAdminSupabase();
  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 200);
  const offset = Math.max(opts.offset ?? 0, 0);

  const { data, count } = await supabase
    .from("profiles")
    .select(
      "id, name, avatar_url, role, is_admin, city, studio_name, created_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const profiles = (data ?? []) as unknown as Array<
    Pick<
      ProfileRow,
      "id" | "name" | "avatar_url" | "role" | "city" | "studio_name" | "created_at"
    > & { is_admin?: boolean | null }
  >;

  const ids = profiles.map((p) => p.id);
  const [emails, lastSignIns] = await Promise.all([
    emailsForIds(ids),
    lastSignInsForIds(ids),
  ]);

  const rows: AppUserRow[] = profiles.map((p) => ({
    id: p.id,
    email: emails.get(p.id) ?? null,
    name: p.name,
    avatar_url: p.avatar_url,
    role: p.role,
    is_admin: p.is_admin ?? null,
    city: p.city,
    studio_name: p.studio_name,
    created_at: p.created_at,
    last_sign_in_at: lastSignIns.get(p.id) ?? null,
  }));

  return { rows, count: count ?? 0 };
}
