import type { DashboardAdminRole } from "@/lib/auth/dashboard-access";
import { logoutAction } from "@/app/dashboard/(panel)/actions";

export function TopBar({
  email,
  adminRole,
}: {
  email: string;
  adminRole?: DashboardAdminRole | null;
}) {
  const initial = (email[0] ?? "?").toUpperCase();
  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-canvas/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-(--mink-text-faint,#6a6a70)">
            Mink admin
            {adminRole ? (
              <span className="ml-2 rounded-pill border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-white/90">
                {adminRole}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-xs font-medium text-white">{email}</span>
            <span className="text-[10px] text-(--mink-text-muted)">
              Signed in
            </span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--mink-brand) text-sm font-semibold text-white">
            {initial}
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-pill border border-white/10 bg-white/3 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/6"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
