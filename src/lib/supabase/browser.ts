"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";
import { supabaseBrowserAuthCookieOptions } from "./auth-cookies";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

/** Singleton browser client. Use only inside client components. */
export function getBrowserSupabase() {
  if (!browserClient) {
    const cookieOpts = supabaseBrowserAuthCookieOptions();
    browserClient = createBrowserClient(
      supabaseEnv.url(),
      supabaseEnv.anonKey(),
      {
        ...(cookieOpts ? { cookieOptions: cookieOpts } : {}),
      },
    );
  }
  return browserClient;
}
