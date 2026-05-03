import { ImagePlaceholder } from "./ImagePlaceholder";
import { SectionEyebrow } from "./Features";

const steps = [
  {
    n: "01",
    title: "Browse the feed",
    body: "Open the app to a curated, scroll-friendly feed of tattoos. Tap a chip to filter by style.",
  },
  {
    n: "02",
    title: "Search any way you want",
    body: "Type a style or city, or upload a reference photo. Image search uses vision AI to surface similar work.",
  },
  {
    n: "03",
    title: "Save into collections",
    body: "Build mood boards. Compare ideas. Bring the right shortlist to your artist consultation.",
  },
  {
    n: "04",
    title: "Reach out to the artist",
    body: "Each tattoo links to its artist&rsquo;s profile, with studio, city and external links.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative scroll-mt-28 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionEyebrow>How it works</SectionEyebrow>
            <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">
              From inspiration to ink, in one app.
            </h2>
          </div>
          <p className="text-base text-(--mink-text-muted) lg:col-span-5">
            No more scattered screenshots, dead Pinterest links or DM threads
            you can&rsquo;t find. Mink keeps the whole journey in one place.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => (
            <div
              key={s.n}
              className="relative flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/2 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium tracking-[0.2em] text-(--mink-brand)">
                  {s.n}
                </span>
                {idx < steps.length - 1 ? (
                  <span className="hidden text-(--mink-text-muted) lg:block">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                ) : null}
              </div>
              <ImagePlaceholder
                ratio={4 / 3}
                radius={12}
                showIcon={false}
              />
              <div>
                <h3 className="text-base font-semibold text-white">
                  {s.title}
                </h3>
                <p
                  className="mt-1.5 text-sm leading-relaxed text-(--mink-text-muted)"
                  dangerouslySetInnerHTML={{ __html: s.body }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
