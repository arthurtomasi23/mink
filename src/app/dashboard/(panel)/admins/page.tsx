import type { Metadata } from "next";
import { getAdminProfiles, getRecentAuditLog } from "@/lib/supabase/queries";
import { getAdminUser } from "@/lib/supabase/server";
import { demoteAdminAction } from "../actions";
import { InviteAdminForm } from "./InviteAdminForm";

export const metadata: Metadata = {
  title: "Admins",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  const me = await getAdminUser();
  const [admins, audit] = await Promise.all([
    getAdminProfiles(),
    getRecentAuditLog(20),
  ]);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Admins
        </h1>
        <p className="mt-1 text-sm text-(--mink-text-muted)">
          Anyone listed here can sign into <code className="rounded bg-white/6 px-1 py-0.5 text-[12px]">/dashboard</code>. Only admins can promote or demote other admins.
        </p>
      </header>

      <section className="rounded-3xl border border-white/8 bg-white/2 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">Invite a new admin</h2>
        <p className="mt-1 text-sm text-(--mink-text-muted)">
          Dashboard access is controlled by <code className="rounded bg-white/6 px-1 py-0.5 text-[12px]">profiles.is_admin</code> (and legacy <code className="rounded bg-white/6 px-1 py-0.5 text-[12px]">role=&apos;admin&apos;</code>). App persona stays <code className="rounded bg-white/6 px-1 py-0.5 text-[12px]">user</code> or <code className="rounded bg-white/6 px-1 py-0.5 text-[12px]">artist</code>. Inviting sets a one-time password — copy it before leaving this page.
        </p>
        <div className="mt-5">
          <InviteAdminForm />
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/8 bg-white/2">
        <div className="border-b border-white/8 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            Current admins ({admins.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-[11px] font-semibold uppercase tracking-wider text-(--mink-text-muted)">
              <tr>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">App role</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => {
                const isMe = a.id === me?.id;
                const last = admins.length === 1;
                return (
                  <tr
                    key={a.id}
                    className="border-t border-white/5"
                  >
                    <td className="px-6 py-3 font-medium text-white">
                      {a.email ?? "—"}
                      {isMe ? (
                        <span className="ml-2 rounded-pill border border-white/10 bg-white/4 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/85">
                          you
                        </span>
                      ) : null}
                    </td>
                    <td className="px-6 py-3 text-(--mink-text-muted)">
                      {a.name ?? "—"}
                    </td>
                    <td className="px-6 py-3 text-(--mink-text-muted)">
                      <span className="rounded-pill border border-white/10 bg-white/4 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                        {a.role === "admin" ? "legacy admin" : a.role}
                      </span>
                      {a.is_admin ? (
                        <span className="ml-1.5 text-[10px] text-(--mink-text-muted)">
                          · is_admin
                        </span>
                      ) : a.role === "admin" ? (
                        <span className="ml-1.5 text-[10px] text-(--mink-text-muted)">
                          · role only
                        </span>
                      ) : null}
                    </td>
                    <td className="px-6 py-3 text-(--mink-text-muted)">
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {isMe ? (
                        <span className="text-[11px] text-white/40">
                          You can&rsquo;t demote yourself
                        </span>
                      ) : last ? (
                        <span className="text-[11px] text-white/40">
                          Last admin — can&rsquo;t demote
                        </span>
                      ) : (
                        <form action={demoteAdminAction} className="inline">
                          <input
                            type="hidden"
                            name="targetId"
                            value={a.id}
                          />
                          <button
                            type="submit"
                            className="rounded-pill border border-white/10 bg-transparent px-3 py-1 text-[11px] font-medium text-(--mink-text-muted) transition hover:border-red-500/40 hover:bg-red-500/8 hover:text-red-200"
                          >
                            Demote
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/8 bg-white/2">
        <div className="border-b border-white/8 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Recent admin activity</h2>
          <p className="mt-1 text-xs text-(--mink-text-muted)">
            All admin actions are recorded for security.
          </p>
        </div>
        <ul className="divide-y divide-white/5">
          {audit.length === 0 ? (
            <li className="px-6 py-10 text-center text-sm text-(--mink-text-muted)">
              No admin activity yet.
            </li>
          ) : (
            audit.map((row) => (
              <li
                key={row.id}
                className="grid grid-cols-1 gap-2 px-6 py-3 text-sm sm:grid-cols-[1fr_2fr_auto]"
              >
                <div className="font-medium text-white">{row.actor_email ?? "—"}</div>
                <div className="text-(--mink-text-muted)">
                  <span className="rounded-pill border border-white/10 bg-white/3 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                    {row.action}
                  </span>
                  {row.target_email ? (
                    <span className="ml-2">→ {row.target_email}</span>
                  ) : null}
                </div>
                <div className="text-right text-xs text-(--mink-text-muted)">
                  {new Date(row.created_at).toLocaleString()}
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
