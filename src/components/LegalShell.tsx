import Link from "next/link";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function LegalShell({
  title,
  intro,
  effectiveDate,
  toc,
  children,
}: {
  title: string;
  intro?: string;
  effectiveDate: string;
  toc: { id: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] opacity-60">
          <div
            className="absolute left-1/2 top-0 h-[420px] w-[80%] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(ellipse at top, rgba(123,44,191,0.18), transparent 70%)",
            }}
          />
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-(--mink-text-muted) transition hover:text-white"
          >
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
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to home
          </Link>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-(--mink-text-muted)">
            Effective date: {effectiveDate}
          </p>
          {intro ? (
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-(--mink-text-muted) sm:text-lg">
              {intro}
            </p>
          ) : null}

          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
            <aside className="lg:sticky lg:top-28 lg:col-span-3 lg:self-start">
              <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-(--mink-text-muted)">
                  On this page
                </div>
                <ol className="mt-4 space-y-1.5 text-sm">
                  {toc.map((item, idx) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="flex items-center gap-2 text-(--mink-text-muted) transition hover:text-white"
                      >
                        <span className="font-mono text-[10px] text-(--mink-brand)">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span>{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            <article className="prose-mink lg:col-span-9">{children}</article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-white/8 py-10 first:border-0 first:pt-0">
      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-(--mink-text-muted)">
        {children}
      </div>
    </section>
  );
}
