/**
 * Centralized, validated env access. Throws *clear* errors when a
 * required variable is missing so misconfiguration fails loudly at
 * boot rather than silently producing 500s in production.
 */

function read(name: string, { required }: { required: boolean }) {
  const value = process.env[name];
  if (!value || value.length === 0) {
    if (required) {
      throw new Error(
        `Missing required environment variable: ${name}. ` +
          `See .env.example for the full list.`,
      );
    }
    return "";
  }
  return value;
}

export const supabaseEnv = {
  url: () => read("NEXT_PUBLIC_SUPABASE_URL", { required: true }),
  anonKey: () => read("NEXT_PUBLIC_SUPABASE_ANON_KEY", { required: true }),
  /** SERVER ONLY. Importing this in a client component will throw. */
  serviceRoleKey: () => {
    if (typeof window !== "undefined") {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY must never be read from the browser.",
      );
    }
    return read("SUPABASE_SERVICE_ROLE_KEY", { required: true });
  },
};

export const posthogEnv = {
  key: () => read("NEXT_PUBLIC_POSTHOG_KEY", { required: false }),
  host: () =>
    read("NEXT_PUBLIC_POSTHOG_HOST", { required: false }) ||
    "https://eu.i.posthog.com",
  projectId: () =>
    read("NEXT_PUBLIC_POSTHOG_PROJECT_ID", { required: false }),
  dashboardUrl: () =>
    read("NEXT_PUBLIC_POSTHOG_DASHBOARD_URL", { required: false }),
};

export function isSupabaseConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Returns the list of environment variables that the dashboard needs
 * but cannot find. Useful for rendering a friendly diagnostic UI
 * instead of a 500 when Vercel is misconfigured.
 */
export function missingDashboardEnv(): string[] {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ] as const;
  return required.filter((k) => !process.env[k] || process.env[k] === "");
}
