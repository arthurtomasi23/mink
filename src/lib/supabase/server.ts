import "server-only";

import { getDashboardAccess } from "@/lib/auth/dashboard-access";

export { getServerSupabase, getCurrentUser } from "./session";

/**
 * User may open /dashboard when `public.is_admin(uid)` is true
 * (`admin_memberships` and/or legacy profile flags).
 */
export async function getAdminUser() {
  const { user, isAdmin } = await getDashboardAccess();
  if (!user || !isAdmin) return null;
  return user;
}
