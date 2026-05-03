import { ImagePlaceholder } from "./ImagePlaceholder";

const features = [
  {
    title: "A feed designed for tattoos",
    body: "Endless, calm, gallery-style scrolling. No dating-app vibes, no algorithmic noise — just craft.",
    icon: GridIcon,
  },
  {
    title: "Search by style or by photo",
    body: "Filter by style, motif, artist or city. Or drop a reference image and let vision AI surface similar work in the gallery.",
    icon: SparkleIcon,
  },
  {
    title: "Save into collections",
    body: "Build mood boards for your sleeve, your next piece, or pure inspiration. Re-arrange and share whenever you&rsquo;re ready.",
    icon: BookmarkIcon,
  },
  {
    title: "Real artists, real context",
    body: "Each artist has a profile with their studio, city and links. Tap any tattoo to see who made it.",
    icon: UserIcon,
  },
];

export function Features() {
  return (
    <section
      id="discover"
      className="relative scroll-mt-28 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <SectionEyebrow>What Mink does</SectionEyebrow>
        <h2 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">
          Built for the way people actually plan a tattoo.
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-base text-(--mink-text-muted) sm:text-lg">
          Most tattoo discovery happens across screenshots, screenshots of
          screenshots, and a hundred saved posts you can&rsquo;t find again.
          Mink replaces the chaos with a single place to search, save and
          decide.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, body, icon: Icon }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-linear-to-b from-white/3 to-transparent p-6 transition hover:border-white/15 hover:bg-white/4"
            >
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "rgba(123, 44, 191, 0.45)" }}
                aria-hidden
              />
              <div className="relative">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/3 text-(--mink-brand)">
                  <Icon />
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">
                  {title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed text-(--mink-text-muted)"
                  // body strings include &rsquo; which we want to render
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </div>
            </article>
          ))}
        </div>

        {/* Big visual — image-search showcase */}
        <div className="mt-20 grid grid-cols-1 gap-10 rounded-3xl border border-white/8 bg-linear-to-b from-white/4 to-transparent p-6 sm:p-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionEyebrow>Image search</SectionEyebrow>
            <h3 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Have a photo? <br />
              <span className="text-(--mink-brand)">Find it on Mink.</span>
            </h3>
            <p className="mt-4 text-base text-(--mink-text-muted)">
              Drop in a reference shot — a Pinterest find, a screenshot, a piece
              you spotted on someone&apos;s arm. Vision AI describes it and we
              surface the closest matching tattoos in the gallery, by style and
              motif.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/85">
              {[
                "Semantic matching, not generic stock results.",
                "Filter by style, technique, and city after.",
                "Save matches straight into a collection.",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
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
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <ImageSearchVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageSearchVisual() {
  return (
    <div className="relative">
      {/* Reference card */}
      <div className="relative z-10 mx-auto max-w-sm rounded-2xl border border-white/10 bg-surface p-3 shadow-2xl">
        <div className="flex items-center justify-between px-1 pb-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-(--mink-text-muted)">
            Your reference
          </span>
          <span className="rounded-pill bg-(--mink-brand-a18) px-2 py-0.5 text-[10px] font-medium text-(--mink-brand)">
            Analyzing…
          </span>
        </div>
        <ImagePlaceholder
          ratio={4 / 5}
          radius={14}
          showIcon
          label="Reference photo"
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Fine-line", "Floral", "Black ink", "Forearm"].map((t) => (
            <span
              key={t}
              className="rounded-pill border border-white/10 bg-white/3 px-2 py-0.5 text-[10px] text-white/80"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Connector */}
      <svg
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 hidden h-40 w-40 -translate-x-1/2 -translate-y-1/2 lg:block"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden
      >
        <circle
          cx="100"
          cy="100"
          r="80"
          stroke="rgba(123, 44, 191, 0.35)"
          strokeDasharray="4 6"
        />
        <circle
          cx="100"
          cy="100"
          r="60"
          stroke="rgba(123, 44, 191, 0.18)"
          strokeDasharray="4 6"
        />
      </svg>

      {/* Match grid */}
      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="relative">
            <ImagePlaceholder ratio={1} radius={12} showIcon={false} />
            <span className="absolute left-2 top-2 rounded-pill bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur">
              {Math.round(96 - i * 4)}% match
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-pill border border-white/10 bg-white/3 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-(--mink-text-muted)">
      <span className="inline-block h-1 w-1 rounded-full bg-(--mink-brand)" />
      {children}
    </div>
  );
}

function GridIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16l7-4 7 4z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}
