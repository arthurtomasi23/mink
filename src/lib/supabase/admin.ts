import "server-only";

import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "./env";

/**
 * Service-role Supabase client. Bypasses Row-Level Security.
 *
 * NEVER import this from client components, hooks, or any module that
 * is also imported from a client component. The `import "server-only"`
 * line will cause a build-time error if anyone tries.
 */
let adminClient: ReturnType<typeof createClient> | null = null;

export function getAdminSupabase() {
  if (!adminClient) {
    adminClient = createClient(
      supabaseEnv.url(),
      supabaseEnv.serviceRoleKey(),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }
  return adminClient;
}
