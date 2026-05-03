import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";

/**
 * Friendly, actionable replacement for the opaque
 * "Application error: a server-side exception has occurred"
 * page that Next.js shows when a server component throws.
 *
 * Used by the dashboard layout when env / Supabase / migrations are
 * not in the expected state.
 */
export function ConfigErrorScreen({
  title,
  cause,
  fix,
}: {
  title: string;
  cause: string;
  fix: ReactNode;
}) {
  return (
    <main className="relative grid min-h-screen place-items-center px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute left-1/2 top-1/3 h-[600px] w-[700px] -translate-x-1/2 -translate-y-1/2 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(244,63,94,0.18), transparent 65%)",
          }}
        />
      </div>

      <div className="w-full max-w-xl">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-8 rounded-3xl border border-amber-400/30 bg-surface/80 p-7 backdrop-blur-md sm:p-9">
          <div className="flex items-start gap-3">
            <div
              aria-hidden
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-400/20 text-amber-200"
            >
              !
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {title}
              </h1>
              <p className="mt-1 text-sm text-(--mink-text-muted)">
                The dashboard wouldn’t render correctly, so we’re showing you
                what’s wrong instead of a blank 500.
              </p>
            </div>
          </div>

          <dl className="mt-6 grid gap-4">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-(--mink-text-muted)">
                Cause
              </dt>
              <dd className="mt-1 wrap-break-word rounded-xl border border-white/8 bg-black/20 p-3 font-mono text-xs text-amber-100">
                {cause}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-(--mink-text-muted)">
                How to fix
              </dt>
              <dd className="mt-1 text-sm text-white/90">{fix}</dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-pill bg-white px-5 py-3 text-sm font-semibold text-canvas transition hover:bg-white/90"
            >
              Try again
            </Link>
            <Link
              href="/dashboard/login"
              className="inline-flex items-center justify-center gap-2 rounded-pill border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Back to sign in
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-(--mink-text-faint,#6a6a70)">
          This screen is only visible to authenticated admins.
        </p>
      </div>
    </main>
  );
}
