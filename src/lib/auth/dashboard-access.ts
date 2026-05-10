import "server-only";

import type { User } from "@supabase/supabase-js";
import { getServerSupabase } from "@/lib/supabase/session";

export type DashboardAdminRole = "owner" | "admin" | "support";

export type DashboardAccessResult =
  | { user: null; isAdmin: false; adminRole: null }
  | { user: User; isAdmin: false; adminRole: null }
  | { user: User; isAdmin: true; adminRole: DashboardAdminRole };

/**
 * Canonical dashboard authorization: trusts `public.is_admin(uid)` (memberships + legacy).
 * `current_admin_role` comes from `admin_memberships` only; legacy admins without a row get `admin`.
 */
export async function getDashboardAccess(): Promise<DashboardAccessResult> {
  const supabase = await getServerSupabase();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      isAdmin: false,
      adminRole: null,
    };
  }

  const { data: isAdminData, error: adminRpcError } = await supabase.rpc(
    "is_admin",
    { uid: user.id } as never,
  );

  if (adminRpcError || isAdminData !== true) {
    return {
      user,
      isAdmin: false,
      adminRole: null,
    };
  }

  const { data: roleRaw, error: roleError } = await supabase.rpc(
    "current_admin_role",
    {} as never,
  );

  if (roleError) {
    return {
      user,
      isAdmin: true,
      adminRole: "admin",
    };
  }

  const r = roleRaw as string | null;
  const typed: DashboardAdminRole | null =
    r === "owner" || r === "admin" || r === "support" ? r : null;

  return {
    user,
    isAdmin: true,
    adminRole: typed ?? "admin",
  };
}
