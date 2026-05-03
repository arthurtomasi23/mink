import type { Metadata } from "next";
import Link from "next/link";
import { getWaitlist } from "@/lib/supabase/queries";
import { deleteWaitlistEntryAction } from "../actions";
import type { WaitlistRole } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Waitlist",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

type SP = Promise<{
  role?: string;
  q?: string;
  page?: string;
}>;

export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const role = (sp.role === "seeker" || sp.role === "artist"
    ? sp.role
    : "all") as WaitlistRole | "all";
  const search = sp.q ?? "";
  const page = Math.max(1, Number(sp.page ?? 1));

  const { data, count, error } = await getWaitlist({
    role,
    search,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Waitlist
          </h1>
          <p className="mt-1 text-sm text-(--mink-text-muted)">
            {count ?? 0} total entries
          </p>
        </div>
        <a
          href={`/api/dashboard/waitlist.csv${role !== "all" ? `?role=${role}` : ""}`}
          className="inline-flex items-center gap-2 rounded-pill border border-white/10 bg-white/3 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/6"
        >
          <DownloadIcon /> Export CSV
        </a>
      </header>

      {/* Filters */}
      <form
        method="get"
        className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/8 bg-white/2 p-3"
      >
        <div className="inline-flex rounded-pill border border-white/10 bg-white/4 p-1">
          {(["all", "seeker", "artist"] as const).map((r) => (
            <button
              key={r}
              type="submit"
              name="role"
              value={r}
              className={`rounded-pill px-3 py-1.5 text-xs font-semibold capitalize transition ${
                role === r ? "bg-white text-canvas" : "text-white/70 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder="Search email, name, city, instagram…"
          className="min-w-0 flex-1 rounded-pill border border-white/10 bg-white/3 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-(--mink-brand) focus:outline-none"
        />
        {(search || role !== "all") && (
          <Link
            href="/dashboard/waitlist"
            className="rounded-pill border border-white/10 bg-transparent px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/4"
          >
            Reset
          </Link>
        )}
      </form>

      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/8 p-4 text-sm text-red-200">
          Failed to load waitlist: {error.message}
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="border-b border-white/8 bg-white/2 text-left text-[11px] font-semibold uppercase tracking-wider text-(--mink-text-muted)">
                <tr>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">City</th>
                  <th className="px-5 py-3">IG</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data ?? []).length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-(--mink-text-muted)"
                    >
                      No matching entries.
                    </td>
                  </tr>
                ) : (
                  (data ?? []).map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-white/5 last:border-b-0"
                    >
                      <td className="px-5 py-3 font-medium text-white">
                        {row.email}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center rounded-pill border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            row.role === "artist"
                              ? "border-(--mink-brand-a60) bg-(--mink-brand-a18) text-white"
                              : "border-white/10 bg-white/4 text-white/80"
                          }`}
                        >
                          {row.role}
                        </span>
                        {row.artist_spot ? (
                          <span className="ml-2 text-[11px] text-(--mink-text-muted)">
                            #{row.artist_spot}
                            {row.artist_spot <= 100 ? " · founding" : ""}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-5 py-3 text-(--mink-text-muted)">
                        {row.name ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-(--mink-text-muted)">
                        {row.city ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-(--mink-text-muted)">
                        {row.instagram ? `@${row.instagram}` : "—"}
                      </td>
                      <td className="px-5 py-3 text-(--mink-text-muted)">
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <form action={deleteWaitlistEntryAction}>
                          <input
                            type="hidden"
                            name="id"
                            value={row.id}
                          />
                          <button
                            type="submit"
                            className="rounded-pill border border-white/10 bg-transparent px-2.5 py-1 text-[11px] font-medium text-(--mink-text-muted) transition hover:border-red-500/40 hover:bg-red-500/8 hover:text-red-200"
                          >
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-white/8 px-5 py-3 text-xs text-(--mink-text-muted)">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <PageLink
                disabled={page <= 1}
                params={{ role, q: search, page: String(page - 1) }}
                label="Prev"
              />
              <PageLink
                disabled={page >= totalPages}
                params={{ role, q: search, page: String(page + 1) }}
                label="Next"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PageLink({
  disabled,
  params,
  label,
}: {
  disabled: boolean;
  params: Record<string, string>;
  label: string;
}) {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && v !== "all") search.set(k, v);
  }
  const href = `/dashboard/waitlist${search.toString() ? `?${search}` : ""}`;
  if (disabled) {
    return (
      <span className="rounded-pill border border-white/10 px-2.5 py-1 text-[11px] font-medium text-white/30">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-pill border border-white/10 bg-white/3 px-2.5 py-1 text-[11px] font-medium text-white transition hover:bg-white/6"
    >
      {label}
    </Link>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
