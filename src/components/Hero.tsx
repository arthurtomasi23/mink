import Link from "next/link";
import { ImagePlaceholder } from "./ImagePlaceholder";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="mink-glow"
          style={{ top: "-20%", left: "-10%" }}
          aria-hidden
        />
        <div
          className="mink-glow"
          style={{
            top: "20%",
            right: "-15%",
            background:
              "radial-gradient(closest-side, rgba(88, 26, 148, 0.55), rgba(88, 26, 148, 0.15) 45%, transparent 70%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse at center top, #000 30%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center top, #000 30%, transparent 70%)",
          }}
          aria-hidden
        />
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6 xl:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-pill border border-white/10 bg-white/4 px-3 py-1.5 text-xs font-medium text-(--mink-text-muted) backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="mink-ping absolute inline-flex h-full w-full rounded-full bg-(--mink-brand) opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-(--mink-brand)" />
            </span>
            Coming soon to iOS — early access open
          </div>

          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Discover tattoos.
            <br />
            <span className="bg-linear-to-r from-white via-white to-(--mink-brand) bg-clip-text text-transparent">
              Save the ones you love.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-(--mink-text-muted)">
            Mink is a discovery-first app for tattoo lovers and the artists
            behind the work. Search by style or by a reference photo, save
            favorites into collections, and explore real artists in your city.
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link
              href="#waitlist"
              className="group inline-flex items-center justify-center gap-2 rounded-pill bg-white px-6 py-3.5 text-sm font-semibold text-canvas shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] transition hover:bg-white/90"
            >
              Join the waitlist
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="#artists"
              className="inline-flex items-center justify-center gap-2 rounded-pill border border-white/12 bg-white/3 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/7"
            >
              I&apos;m a tattoo artist
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-6 text-xs text-(--mink-text-muted)">
            <div className="flex items-center gap-2">
              <CheckIcon /> Free for tattoo seekers — forever
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <CheckIcon /> First 100 artists: 3 months free
            </div>
          </div>
        </div>

        {/* Visual: stylized "phone" preview with masonry imagery */}
        <div className="relative lg:col-span-6 xl:col-span-5">
          <PhonePreview />
        </div>
      </div>

      {/* Marquee row of tattoo placeholders, full bleed */}
      <div className="relative mt-20 overflow-hidden border-y border-white/6 bg-white/2 py-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-(--mink-bg-canvas) to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-(--mink-bg-canvas) to-transparent" />
        <div className="mink-marquee flex gap-4 whitespace-nowrap will-change-transform">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-4">
              {Array.from({ length: 10 }).map((_, j) => (
                <ImagePlaceholder
                  key={`${i}-${j}`}
                  className="h-[140px] w-[110px] shrink-0"
                  ratio={110 / 140}
                  showIcon={false}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-(--mink-brand-a18) text-(--mink-brand)">
      <svg
        width="10"
        height="10"
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
  );
}

function PhonePreview() {
  return (
    <div className="relative mx-auto max-w-[420px]">
      {/* Floating "search by photo" chip behind the phone */}
      <div className="mink-float mink-float--delay absolute -left-6 top-10 z-10 hidden rounded-2xl border border-white/10 bg-surface/90 p-3 shadow-2xl backdrop-blur-md sm:block">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--mink-brand-a18) text-(--mink-brand)">
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
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-(--mink-text-muted)">
              Image search
            </div>
            <div className="text-xs font-medium text-white">
              Fine-line · botanical
            </div>
          </div>
        </div>
      </div>

      {/* Floating artist chip */}
      <div className="mink-float absolute -right-4 bottom-16 z-10 hidden rounded-2xl border border-white/10 bg-surface/90 p-3 shadow-2xl backdrop-blur-md sm:block">
        <div className="flex items-center gap-2.5">
          <ImagePlaceholder
            className="h-9 w-9"
            ratio={1}
            radius={999}
            showIcon={false}
          />
          <div>
            <div className="text-xs font-semibold text-white">@studio.lune</div>
            <div className="text-[11px] text-(--mink-text-muted)">
              Lisbon · 124 pieces
            </div>
          </div>
        </div>
      </div>

      {/* Phone frame */}
      <div
        className="relative rounded-[42px] border border-white/10 bg-surface-deep p-3 shadow-2xl"
        style={{
          boxShadow:
            "0 50px 100px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.02)",
        }}
      >
        <div className="relative overflow-hidden rounded-[32px] bg-canvas">
          {/* Notch */}
          <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />

          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1.5 text-[10px] font-semibold text-white/80">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-white/70" />
              <span className="inline-block h-2 w-3 rounded-sm bg-white/70" />
            </span>
          </div>

          {/* Search pill */}
          <div className="px-4 pt-4">
            <div className="flex items-center gap-2 rounded-pill border border-white/8 bg-white/4 px-3 py-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/60"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className="text-[11px] text-white/60">
                Search styles, artists, cities…
              </span>
              <span className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--mink-brand) text-[10px] text-white">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="9" cy="9" r="1.5" />
                  <path d="m21 15-3.5-4.5L13 16l-2.5-3L3 21" />
                </svg>
              </span>
            </div>
          </div>

          {/* Style chips */}
          <div className="mt-3 flex gap-1.5 overflow-hidden px-4">
            {["All", "Fine-line", "Blackwork", "Traditional", "Realism"].map(
              (chip, i) => (
                <span
                  key={chip}
                  className={`shrink-0 rounded-pill border px-2.5 py-1 text-[10px] font-medium ${
                    i === 0
                      ? "border-(--mink-brand) bg-(--mink-brand) text-white"
                      : "border-white/10 bg-white/3 text-white/70"
                  }`}
                >
                  {chip}
                </span>
              ),
            )}
          </div>

          {/* Masonry feed */}
          <div className="mt-3 grid grid-cols-2 gap-1.5 px-3 pb-4">
            <div className="flex flex-col gap-1.5">
              <ImagePlaceholder ratio={3 / 4} radius={10} showIcon={false} />
              <ImagePlaceholder ratio={1} radius={10} showIcon={false} />
              <ImagePlaceholder ratio={4 / 5} radius={10} showIcon={false} />
            </div>
            <div className="mt-4 flex flex-col gap-1.5">
              <ImagePlaceholder ratio={1} radius={10} showIcon={false} />
              <ImagePlaceholder ratio={3 / 4} radius={10} showIcon={false} />
              <ImagePlaceholder ratio={5 / 6} radius={10} showIcon={false} />
            </div>
          </div>

          {/* Bottom tab bar */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-white/5 bg-canvas/95 px-4 py-3 backdrop-blur-xl">
            {[
              { label: "Discover", active: true },
              { label: "Search", active: false },
              { label: "Saved", active: false },
              { label: "Profile", active: false },
            ].map((t) => (
              <div
                key={t.label}
                className="flex flex-col items-center gap-1 text-[9px]"
              >
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    t.active ? "bg-(--mink-brand)" : "bg-white/20"
                  }`}
                />
                <span
                  className={
                    t.active
                      ? "font-semibold text-white"
                      : "text-white/40"
                  }
                >
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
