"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import posthog from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";
const STORAGE_KEY = "mink.cookieConsent.v1";

function readConsent(): { analytics: boolean; marketing: boolean } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      analytics?: boolean;
      marketing?: boolean;
    };
    return {
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
    };
  } catch {
    return null;
  }
}

/**
 * Initializes PostHog *only* after the user has accepted the analytics
 * cookie category. Re-checks on the storage event so consent changes
 * take effect immediately.
 */
function PostHogPageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!KEY) return;

    function init() {
      const consent = readConsent();
      if (consent?.analytics && !posthog.__loaded) {
        posthog.init(KEY!, {
          api_host: HOST,
          capture_pageview: false,
          capture_pageleave: true,
          person_profiles: "identified_only",
          autocapture: false,
          disable_session_recording: !consent.marketing,
        });
      }
    }

    init();
    window.addEventListener("storage", init);
    window.addEventListener("mink:consent", init);
    return () => {
      window.removeEventListener("storage", init);
      window.removeEventListener("mink:consent", init);
    };
  }, []);

  useEffect(() => {
    if (!KEY || !posthog.__loaded) return;
    const url =
      pathname +
      (searchParams && searchParams.toString()
        ? `?${searchParams.toString()}`
        : "");
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider() {
  if (!KEY) return null;
  return (
    <Suspense fallback={null}>
      <PostHogPageviewTracker />
    </Suspense>
  );
}

/** Helper for capturing custom events from anywhere on the client. */
export function trackEvent(
  event: string,
  properties?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
}
