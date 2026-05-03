"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Overview", icon: GridIcon },
  { href: "/dashboard/waitlist", label: "Waitlist", icon: ListIcon },
  { href: "/dashboard/users", label: "App users", icon: UsersIcon },
  { href: "/dashboard/admins", label: "Admins", icon: ShieldIcon },
  { href: "/dashboard/analytics", label: "Analytics", icon: ChartIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <nav className="px-3 pb-4">
      <div className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-(--mink-text-faint,#6a6a70)">
        Mink admin
      </div>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-white/6 text-white"
                    : "text-(--mink-text-muted) hover:bg-white/4 hover:text-white"
                }`}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-md ${
                    active
                      ? "bg-(--mink-brand-a18) text-(--mink-brand)"
                      : "text-(--mink-text-muted)"
                  }`}
                >
                  <Icon />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1" />
      <circle cx="4" cy="12" r="1" />
      <circle cx="4" cy="18" r="1" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="3" y1="20" x2="21" y2="20" />
      <rect x="5" y="11" width="3" height="9" />
      <rect x="10.5" y="6" width="3" height="14" />
      <rect x="16" y="14" width="3" height="6" />
    </svg>
  );
}
