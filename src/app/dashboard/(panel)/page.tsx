import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChart } from "@/components/dashboard/BarChart";
import { getDashboardStats } from "@/lib/supabase/queries";
import { ConfigErrorScreen } from "./ConfigErrorScreen";

export const metadata: Metadata = {
  title: "Overview",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OverviewPage() {
  let stats: Awaited<ReturnType<typeof getDashboardStats>>;
  try {
    stats = await getDashboardStats();
  } catch (err) {
    console.error("[dashboard] getDashboardStats failed:", err);
    const message = (err as Error).message ?? String(err);
    const looksLikeMissingTable =
      /relation .* does not exist|404|Not Found|PGRST205|PGRST204/i.test(
        message,
      );
    return (
      <ConfigErrorScreen
        title="Couldn’t load dashboard data"
        cause={message}
        fix={
          looksLikeMissingTable ? (
            <>
              The Supabase project linked in Vercel is missing the
              tables this dashboard expects. Apply the migration{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px]">
                supabase/migrations/20260503140000_admin_and_waitlist.sql
              </code>{" "}
              in <strong>Supabase → SQL editor</strong>, then refresh.
            </>
          ) : (
            <>
              Re-check that{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px]">
                SUPABASE_SERVICE_ROLE_KEY
              </code>{" "}
              in Vercel matches the project pointed to by{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px]">
                NEXT_PUBLIC_SUPABASE_URL
              </code>
              . They must belong to the same Supabase project.
            </>
          )
        }
      />
    );
  }
  const t = stats.totals;

  const chartData = stats.perDay.map((d) => ({
    label: new Date(d.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    value: d.total,
  }));

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Overview
        </h1>
        <p className="mt-1 text-sm text-(--mink-text-muted)">
          Live snapshot of waitlist + app signups, served straight from your Supabase project.
        </p>
      </header>

      {/* KPI grid */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Waitlist total"
          value={t.waitlistTotal.toLocaleString()}
          sub={`${t.waitlistLast7d} new in the last 7 days`}
          delta={
            t.growthPct === null
              ? null
              : { value: t.growthPct, positive: t.growthPct >= 0 }
          }
        />
        <StatCard
          label="Tattoo seekers"
          value={t.seekers.toLocaleString()}
          sub={`${t.seekersLast7d} new this week`}
        />
        <StatCard
          label="Artists"
          value={t.artists.toLocaleString()}
          sub={`${t.artistsLast7d} new this week`}
          accent={t.artists > 0 ? "brand" : "default"}
        />
        <StatCard
          label="Founding spots left"
          value={`${t.foundingRemaining}/100`}
          sub={
            t.foundingRemaining === 0
              ? "All 100 founding spots claimed"
              : `${t.foundingClaimed} claimed`
          }
          accent="brand"
        />
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="App users"
          value={t.appUsers.toLocaleString()}
          sub={`${t.appUsersLast7d} new this week`}
          hint="Counted from auth.users"
        />
        <StatCard
          label="Admins"
          value={t.admins.toLocaleString()}
          hint={
            <>
              Manage in{" "}
              <Link
                href="/dashboard/admins"
                className="text-white underline underline-offset-2"
              >
                Admins
              </Link>
            </>
          }
        />
        <StatCard
          label="This week / last week"
          value={`${t.waitlistLast7d} / ${t.waitlistPrev7d}`}
          sub="Waitlist signups"
        />
        <StatCard
          label="Conversion mix"
          value={
            t.waitlistTotal === 0
              ? "—"
              : `${Math.round((t.artists / t.waitlistTotal) * 100)}% artists`
          }
          sub={`${t.seekers} seekers · ${t.artists} artists`}
        />
      </section>

      {/* 30-day chart */}
      <section className="rounded-3xl border border-white/8 bg-white/2 p-6 sm:p-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Waitlist signups · last 30 days
            </h2>
            <p className="text-xs text-(--mink-text-muted)">
              Daily totals (seekers + artists)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-(--mink-text-muted)">
            <Legend swatch="#a259f7" label="Total" />
          </div>
        </div>
        <div className="mt-6">
          <BarChart
            data={chartData}
            height={180}
            formatTooltip={(d) => `${d.label}: ${d.value} signup${d.value === 1 ? "" : "s"}`}
          />
        </div>
      </section>

      {/* Recent signups */}
      <section className="rounded-3xl border border-white/8 bg-white/2">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            Recent signups
          </h2>
          <Link
            href="/dashboard/waitlist"
            className="text-xs font-medium text-(--mink-text-muted) hover:text-white"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-y border-white/8 bg-white/2 text-left text-[11px] font-semibold uppercase tracking-wider text-(--mink-text-muted)">
              <tr>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Detail</th>
                <th className="px-6 py-3 text-right">Joined</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSignups.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-(--mink-text-muted)"
                  >
                    No signups yet. Share the landing page to get the first one.
                  </td>
                </tr>
              ) : (
                stats.recentSignups.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-white/5 last:border-b-0"
                  >
                    <td className="px-6 py-3 font-medium text-white">
                      {row.email}
                    </td>
                    <td className="px-6 py-3">
                      <RolePill role={row.role} />
                      {row.artist_spot ? (
                        <span className="ml-2 rounded-pill border border-white/10 bg-white/4 px-2 py-0.5 text-[10px] font-semibold text-white/85">
                          #{row.artist_spot}
                          {row.artist_spot <= 100 ? " · founding" : ""}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-6 py-3 text-(--mink-text-muted)">
                      {[row.name, row.city].filter(Boolean).join(" · ") || "—"}
                    </td>
                    <td className="px-6 py-3 text-right text-(--mink-text-muted)">
                      {formatRelative(row.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ background: swatch }}
      />
      {label}
    </span>
  );
}

function RolePill({ role }: { role: "seeker" | "artist" }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        role === "artist"
          ? "border-(--mink-brand-a60) bg-(--mink-brand-a18) text-white"
          : "border-white/10 bg-white/4 text-white/80"
      }`}
    >
      {role}
    </span>
  );
}

function formatRelative(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}
