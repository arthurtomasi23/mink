import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";
import { supabaseAuthCookieOptions } from "./auth-cookies";

/**
 * Cookie-bound Supabase client for Server Components, Route Handlers,
 * and Server Actions.
 */
export async function getServerSupabase() {
  const cookieStore = await cookies();
  const cookieOpts = supabaseAuthCookieOptions();

  return createServerClient(
    supabaseEnv.url(),
    supabaseEnv.anonKey(),
    {
      ...(cookieOpts ? { cookieOptions: cookieOpts } : {}),
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
            // Cookies may not be mutable during RSC render; middleware refreshes session.
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
