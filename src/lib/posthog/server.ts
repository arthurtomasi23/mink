import "server-only";

import { PostHog } from "posthog-node";
import { posthogEnv } from "@/lib/supabase/env";

let posthog: PostHog | null = null;

export function getServerPostHog() {
  const key = posthogEnv.key();
  if (!key) return null;
  if (!posthog) {
    posthog = new PostHog(key, {
      host: posthogEnv.host(),
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthog;
}

export async function captureServer(
  event: string,
  distinctId: string,
  properties?: Record<string, unknown>,
) {
  const ph = getServerPostHog();
  if (!ph) return;
  ph.capture({
    distinctId,
    event,
    properties: { source: "web-server", ...properties },
  });
  // We use flushAt:1 + flushInterval:0 so this resolves quickly.
  try {
    await ph.flush();
  } catch {
    // analytics must never break the user's request
  }
}
