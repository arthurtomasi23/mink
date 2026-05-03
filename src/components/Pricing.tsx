import Link from "next/link";
import { SectionEyebrow } from "./Features";

const tiers = [
  {
    audience: "Tattoo seekers",
    headline: "Free, forever.",
    sub: "Browse, save, search by photo, follow artists. No paywall on discovery.",
    bullets: [
      "Unlimited collections",
      "Image-based search",
      "Follow as many artists as you want",
      "No ads in the feed",
    ],
    cta: { label: "Join the waitlist", href: "#waitlist" },
    highlight: false,
  },
  {
    audience: "Tattoo artists",
    headline: "3 months free for the first 100.",
    sub: "Founding artists keep their three free months and a permanent badge on their profile.",
    bullets: [
      "Unlimited uploads",
      "AI-suggested style tags",
      "City & studio discovery",
      "Founding artist badge — for life",
    ],
    cta: { label: "Claim a founding spot", href: "#waitlist" },
    highlight: true,
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative scroll-mt-28 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <SectionEyebrow>Early access pricing</SectionEyebrow>
          </div>
          <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">
            Free for everyone discovering. <br />
            <span className="text-(--mink-brand)">
              Free for the first 100 artists.
            </span>
          </h2>
          <p className="mt-5 text-base text-(--mink-text-muted) sm:text-lg">
            We&rsquo;re launching with the people who&rsquo;ll shape Mink — no
            paywalls for seekers, and a generous head start for the first
            artists who join us.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {tiers.map((t) => (
            <div
              key={t.audience}
              className={`relative overflow-hidden rounded-3xl border p-7 sm:p-9 ${
                t.highlight
                  ? "border-(--mink-brand-a60) bg-linear-to-b from-brand/16 to-brand/4"
                  : "border-white/8 bg-white/2"
              }`}
            >
              {t.highlight ? (
                <span className="absolute right-6 top-6 rounded-pill bg-(--mink-brand) px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                  Limited · 100 spots
                </span>
              ) : null}

              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-(--mink-text-muted)">
                {t.audience}
              </div>
              <h3 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {t.headline}
              </h3>
              <p className="mt-2 text-sm text-(--mink-text-muted) sm:text-base">
                {t.sub}
              </p>

              <ul className="mt-6 space-y-2.5">
                {t.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-sm text-white/85"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--mink-brand-a18) text-(--mink-brand)">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <Link
                href={t.cta.href}
                className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-pill px-5 py-3 text-sm font-semibold transition ${
                  t.highlight
                    ? "bg-(--mink-brand) text-white hover:bg-(--mink-brand-600)"
                    : "bg-white text-canvas hover:bg-white/90"
                }`}
              >
                {t.cta.label}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>

              <p className="mt-4 text-center text-xs text-(--mink-text-faint,#6a6a70)">
                {t.highlight
                  ? "After 3 months, an honest, transparent monthly plan. No surprises."
                  : "Always free for tattoo seekers. We mean it."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
