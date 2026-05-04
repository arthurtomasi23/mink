import type { Metadata } from "next";
import Link from "next/link";
import { getAppUsers } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "App users",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

type SP = Promise<{ page?: string }>;

function hasDashboardAccess(u: { is_admin: boolean | null; role: string }) {
  return u.is_admin === true || u.role === "admin";
}

export default async function UsersPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));

  const { rows, count } = await getAppUsers({
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            App users
          </h1>
          <p className="mt-1 text-sm text-(--mink-text-muted)">
            {count.toLocaleString()} total · everyone with an auth account
          </p>
        </div>
      </header>

      <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/2">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="border-b border-white/8 bg-white/2 text-left text-[11px] font-semibold uppercase tracking-wider text-(--mink-text-muted)">
              <tr>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Last sign-in</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-(--mink-text-muted)"
                  >
                    No users yet.
                  </td>
                </tr>
              ) : (
                rows.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 last:border-b-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} url={u.avatar_url} />
                        <div className="min-w-0">
                          <div className="truncate font-medium text-white">
                            {u.name ?? u.email ?? "—"}
                          </div>
                          <div className="truncate text-[11px] text-(--mink-text-muted)">
                            {u.email ?? "no email"}
                            {u.studio_name ? ` · ${u.studio_name}` : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center rounded-pill border border-white/10 bg-white/4 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">
                          {u.role === "admin" ? "admin (legacy)" : u.role || "user"}
                        </span>
                        {hasDashboardAccess(u) ? (
                          <span className="inline-flex items-center rounded-pill border border-(--mink-brand-a60) bg-(--mink-brand-a18) px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                            Dashboard
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-(--mink-text-muted)">
                      {u.city ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-(--mink-text-muted)">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-(--mink-text-muted)">
                      {u.last_sign_in_at
                        ? new Date(u.last_sign_in_at).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-white/8 px-5 py-3 text-xs text-(--mink-text-muted)">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <PageLink disabled={page <= 1} href={`/dashboard/users?page=${page - 1}`} label="Prev" />
            <PageLink
              disabled={page >= totalPages}
              href={`/dashboard/users?page=${page + 1}`}
              label="Next"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Avatar({ name, url }: { name: string | null; url: string | null }) {
  const initial = (name ?? "?").trim().charAt(0).toUpperCase() || "?";
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        className="h-9 w-9 shrink-0 rounded-full border border-white/10 object-cover"
      />
    );
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/4 text-xs font-semibold text-white/80">
      {initial}
    </div>
  );
}

function PageLink({
  disabled,
  href,
  label,
}: {
  disabled: boolean;
  href: string;
  label: string;
}) {
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
