import { ImagePlaceholder } from "./ImagePlaceholder";
import { SectionEyebrow } from "./Features";

const benefits = [
  {
    title: "A profile that respects your craft",
    body: "Editorial-style portfolio with studio, city, and links to Instagram or your booking site.",
  },
  {
    title: "Get found by style, not by hashtag wars",
    body: "AI-suggested tags help your work surface to the right seekers. Less spam, more booked sessions.",
  },
  {
    title: "Upload in seconds",
    body: "Drag in photos, confirm style tags, publish. No demoralizing platform mechanics.",
  },
  {
    title: "Own your followers",
    body: "Followers and saves stay yours. Export your data anytime — no lock-in.",
  },
];

export function ForArtists() {
  return (
    <section
      id="artists"
      className="relative scroll-mt-28 overflow-hidden py-24 sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div
          className="absolute inset-x-0 top-1/3 h-[60%] opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(123,44,191,0.18), transparent 60%)",
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionEyebrow>For artists</SectionEyebrow>
            <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">
              Be discovered by people who actually want a tattoo.
            </h2>
            <p className="mt-5 text-base text-(--mink-text-muted) sm:text-lg">
              Mink isn&rsquo;t another general-purpose social feed. It&rsquo;s a
              curated, intent-driven discovery surface for tattoo work — built
              by people who care about the craft.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-xl border border-white/8 bg-white/2 p-4"
                >
                  <h3 className="text-sm font-semibold text-white">
                    {b.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-(--mink-text-muted)">
                    {b.body}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="mt-8 rounded-2xl border border-(--mink-brand-a18) bg-(--mink-brand-a10) p-5"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-(--mink-brand)">
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
                  <path d="M12 2 15 8l6 .9-4.5 4.4 1 6.2L12 16.8 6.5 19.5l1-6.2L3 8.9 9 8z" />
                </svg>
                Founding artists offer
              </div>
              <p className="mt-2 text-sm text-white">
                The first <strong className="font-semibold">100 artists</strong>{" "}
                to join get their first <strong>three months free</strong>, plus
                lifetime founding-artist status.
              </p>
              <a
                href="#waitlist"
                className="mt-4 inline-flex items-center gap-2 rounded-pill bg-white px-4 py-2 text-sm font-semibold text-canvas transition hover:bg-white/90"
              >
                Claim a spot
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
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ArtistProfileMock />
          </div>
        </div>
      </div>
    </section>
  );
}

function ArtistProfileMock() {
  return (
    <div className="relative">
      <div className="rounded-3xl border border-white/10 bg-surface p-5 shadow-2xl sm:p-7">
        <div className="flex items-center gap-4">
          <ImagePlaceholder
            className="h-16 w-16 sm:h-20 sm:w-20"
            ratio={1}
            radius={999}
            showIcon={false}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white sm:text-xl">
                @studio.lune
              </h3>
              <span className="rounded-pill bg-(--mink-brand-a18) px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-(--mink-brand)">
                Founding
              </span>
            </div>
            <div className="mt-1 text-sm text-(--mink-text-muted)">
              Lisbon · Fine-line, botanical
            </div>
          </div>
          <button
            type="button"
            className="hidden rounded-pill bg-white px-4 py-2 text-sm font-semibold text-canvas sm:inline-flex"
          >
            Follow
          </button>
        </div>

        <div className="mt-5 flex items-center gap-6 text-sm">
          <div>
            <div className="font-semibold text-white">124</div>
            <div className="text-xs text-(--mink-text-muted)">
              Pieces
            </div>
          </div>
          <div>
            <div className="font-semibold text-white">2.4k</div>
            <div className="text-xs text-(--mink-text-muted)">
              Followers
            </div>
          </div>
          <div>
            <div className="font-semibold text-white">18k</div>
            <div className="text-xs text-(--mink-text-muted)">
              Saves
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {[
            "Fine-line",
            "Botanical",
            "Black ink",
            "Minimal",
            "Linework",
          ].map((t) => (
            <span
              key={t}
              className="rounded-pill border border-white/10 bg-white/3 px-2.5 py-1 text-[11px] font-medium text-white/80"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <ImagePlaceholder
              key={i}
              ratio={1}
              radius={10}
              showIcon={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
