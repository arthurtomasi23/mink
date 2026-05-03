import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";

/**
 * Cookie-bound Supabase client for use in Server Components, Route
 * Handlers and Server Actions. Reads/writes the auth cookies set by
 * `@supabase/ssr` so sessions stay in sync.
 */
export async function getServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    supabaseEnv.url(),
    supabaseEnv.anonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a server component during render — Next.js
            // forbids mutating cookies there. Middleware handles
            // refreshes; this branch is safe to ignore.
          }
        },
      },
    },
  );
}

/** Returns the currently signed-in user, or null. */
export async function getCurrentUser() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Returns the user *only if* they have admin role; null otherwise. */
export async function getAdminUser() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: isAdmin, error } = await supabase.rpc("is_admin", {
    uid: user.id,
  } as never);
  if (error || isAdmin !== true) return null;
  return user;
}
