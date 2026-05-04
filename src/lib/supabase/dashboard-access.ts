/**
 * PostgREST `.or()` fragment for “who can open /dashboard”.
 * Matches `public.is_admin(uid)` semantics: `profiles.is_admin` (new) or
 * legacy `profiles.role = 'admin'`.
 */
export const DASHBOARD_ADMIN_OR = "is_admin.eq.true,role.eq.admin";
