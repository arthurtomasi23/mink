import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { getDashboardAccess } from "@/lib/auth/dashboard-access";
import { missingDashboardEnv } from "@/lib/supabase/env";
import { ConfigErrorScreen } from "./ConfigErrorScreen";

export const dynamic = "force-dynamic";

/**
 * Defense in depth: middleware gates first; layout re-validates auth + `is_admin()`.
 */
export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const missing = missingDashboardEnv();
  if (missing.length > 0) {
    return (
      <ConfigErrorScreen
        title="Dashboard isn’t fully configured"
        cause={`Missing environment variable${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`}
        fix={
          <>
            Add the missing variable{missing.length > 1 ? "s" : ""} in{" "}
            <strong>Vercel → your project → Settings → Environment Variables</strong>{" "}
            (Production, Preview, and Development), then redeploy without cache.
          </>
        }
      />
    );
  }

  let access: Awaited<ReturnType<typeof getDashboardAccess>>;
  try {
    access = await getDashboardAccess();
  } catch (err) {
    console.error("[dashboard] getDashboardAccess failed:", err);
    return (
      <ConfigErrorScreen
        title="Couldn’t verify your admin session"
        cause={(err as Error).message}
        fix={
          <>
            Re-check Supabase keys and ensure{" "}
            <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px]">
              public.is_admin()
            </code>{" "}
            and{" "}
            <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px]">
              current_admin_role()
            </code>{" "}
            exist (mobile migrations).
          </>
        }
      />
    );
  }

  if (!access.user) {
    redirect("/dashboard/login?next=%2Fdashboard");
  }

  if (!access.isAdmin) {
    redirect("/dashboard/unauthorized");
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-white/8 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 px-6 py-5">
          <Logo />
          <span className="ml-2 inline-flex items-center rounded-pill border border-white/10 bg-white/4 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-(--mink-text-muted)">
            Admin
          </span>
        </div>
        <Sidebar />
        <div className="hidden p-4 lg:block">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/2 px-3 py-2 text-xs text-(--mink-text-muted) transition hover:bg-white/5 hover:text-white"
          >
            <span>←</span>
            View public site
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <TopBar
          email={access.user.email ?? ""}
          adminRole={access.adminRole}
        />
        <main className="flex-1 px-5 py-8 sm:px-8 sm:py-10">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
