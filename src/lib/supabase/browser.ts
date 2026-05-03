"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

/** Singleton browser client. Use only inside client components. */
export function getBrowserSupabase() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      supabaseEnv.url(),
      supabaseEnv.anonKey(),
    );
  }
  return browserClient;
}
