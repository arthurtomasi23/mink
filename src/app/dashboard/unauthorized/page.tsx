import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { logoutAction } from "@/app/dashboard/(panel)/actions";

export const metadata: Metadata = {
  title: "Access denied",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Shown when the user is signed in but `public.is_admin()` is false
 * (no `admin_memberships` row and no legacy profile admin flags).
 */
export default function DashboardUnauthorizedPage() {
  return (
    <main className="relative grid min-h-screen place-items-center px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute left-1/2 top-1/3 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(244,63,94,0.2), transparent 65%)",
          }}
        />
      </div>

      <div className="w-full max-w-md text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-8 rounded-3xl border border-white/10 bg-surface/80 p-7 backdrop-blur-md sm:p-9">
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Access denied
          </h1>
          <p className="mt-3 text-sm text-(--mink-text-muted)">
            You’re signed in, but this account doesn’t have dashboard access.
            Ask an <strong className="text-white/90">owner</strong> to add you
            to <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px]">admin_memberships</code>{" "}
            in Supabase, or use a team account that already has access.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <form action={logoutAction} className="inline">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-pill border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              >
                Sign out & try another account
              </button>
            </form>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-pill bg-white px-5 py-3 text-sm font-semibold text-canvas transition hover:bg-white/90"
            >
              Back to site
            </Link>
          </div>
        </div>
        <p className="mt-6 text-xs text-(--mink-text-faint,#6a6a70)">
          If you think this is a mistake, contact your Mink team owner.
        </p>
      </div>
    </main>
  );
}
