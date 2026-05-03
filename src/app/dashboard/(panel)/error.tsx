"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Last-resort error boundary for the protected dashboard subtree.
 *
 * Server components throw → Next.js renders this client component
 * with the error object. Without it, you get a blank
 * "Application error" page in production.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[dashboard] unhandled:", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-red-500/30 bg-surface/80 p-7 text-white">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-(--mink-text-muted)">
          The dashboard couldn’t finish rendering.
        </p>
        <pre className="mt-4 max-h-48 overflow-auto rounded-xl border border-white/10 bg-black/30 p-3 font-mono text-[11px] text-amber-100">
          {error.message || "Unknown error"}
          {error.digest ? `\n\nDigest: ${error.digest}` : ""}
        </pre>
        <p className="mt-3 text-xs text-(--mink-text-muted)">
          The full stack trace is in your Vercel function logs (filter by
          this digest).
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-pill bg-white px-5 py-3 text-sm font-semibold text-canvas transition hover:bg-white/90"
          >
            Try again
          </button>
          <Link
            href="/dashboard/login"
            className="inline-flex items-center justify-center gap-2 rounded-pill border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Sign out & back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
