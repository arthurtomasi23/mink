import Link from "next/link";
import { Logo } from "./Logo";

const product = [
  { label: "What is Mink", href: "#discover" },
  { label: "How it works", href: "#discover" },
  { label: "For artists", href: "#artists" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const legal = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Terms of Service", href: "/terms" },
];

const contact = [
  { label: "Press / partnerships", href: "mailto:hello@mink.app" },
  { label: "Support", href: "mailto:support@mink.app" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-canvas-deep">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-(--mink-text-muted)">
              Mink is a discovery-first tattoo app. Find inspiration, save it
              into collections, and connect with the artists behind the work.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div
                className="inline-flex items-center gap-2 rounded-pill border border-white/10 bg-white/3 px-3 py-1.5 text-xs text-(--mink-text-muted)"
                aria-label="Coming to the App Store"
              >
                <AppleGlyph /> Coming to the App Store
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <FooterCol title="Product" items={product} />
            <FooterCol title="Legal" items={legal} />
            <FooterCol title="Contact" items={contact} />
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-white/8 pt-6 text-xs text-(--mink-text-faint,#6a6a70) sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Mink. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-(--mink-text-muted) transition hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-(--mink-text-muted)">
        {title}
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i.href + i.label}>
            <Link
              href={i.href}
              className="text-sm text-white/80 transition hover:text-white"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AppleGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M16.365 1.43c0 1.14-.46 2.21-1.21 3.02-.74.79-1.97 1.41-3.18 1.31-.13-1.13.43-2.31 1.18-3.07.83-.86 2.21-1.43 3.21-1.26zM21 17.5c-.66 1.5-1 2.17-1.86 3.5-1.18 1.81-2.84 4.07-4.91 4.09-1.83.02-2.31-1.2-4.81-1.18-2.5.02-3.04 1.2-4.88 1.18-2.07-.02-3.65-2.05-4.83-3.86C-1.83 16.7-2.21 9.95 1 7.65c1.66-1.18 3.36-1.05 4.86-1.04 1.7.02 3.16 1.18 4.71 1.16 1.55-.03 2.49-1.34 4.93-1.16 1.04.04 2.46.43 3.7 1.61-3.27 1.78-2.74 6.46.8 9.28z" />
    </svg>
  );
}
