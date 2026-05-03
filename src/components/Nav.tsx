"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "#discover", label: "Discover" },
  { href: "#artists", label: "For artists" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <nav
          className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 sm:px-5 ${
            scrolled
              ? "border border-white/8 bg-canvas/80 backdrop-blur-xl"
              : "border border-transparent"
          }`}
        >
          <Logo />

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-pill px-3 py-2 text-sm font-medium text-(--mink-text-muted) transition hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="#waitlist"
              className="rounded-pill bg-white px-4 py-2 text-sm font-semibold text-canvas transition hover:bg-white/90"
            >
              Join the waitlist
            </Link>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white md:hidden"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </nav>

        {mobileOpen ? (
          <div className="mt-2 rounded-2xl border border-white/8 bg-canvas/95 p-3 backdrop-blur-xl md:hidden">
            <div className="flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-white/90 hover:bg-white/5"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="#waitlist"
                onClick={() => setMobileOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-pill bg-white px-4 py-3 text-sm font-semibold text-canvas"
              >
                Join the waitlist
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
