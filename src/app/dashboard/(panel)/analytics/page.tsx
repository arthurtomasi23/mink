import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";
const POSTHOG_PROJECT_ID = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID;
const POSTHOG_DASHBOARD_URL = process.env.NEXT_PUBLIC_POSTHOG_DASHBOARD_URL;

export default function AnalyticsPage() {
  const projectUrl = POSTHOG_PROJECT_ID
    ? `${POSTHOG_HOST.replace(/\/$/, "")}/project/${POSTHOG_PROJECT_ID}`
    : POSTHOG_HOST.replace(/\/$/, "");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-(--mink-text-muted)">
          Powered by PostHog. The same project tracks both this website and your iOS app, so funnels, retention and cohorts can flow across surfaces.
        </p>
      </header>

      <section className="rounded-3xl border border-white/8 bg-white/2 p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Open in PostHog
            </h2>
            <p className="mt-2 text-sm text-(--mink-text-muted)">
              Build funnels, watch session replays, define cohorts and ship feature flags. Use the same project key in your Expo app:{" "}
              <code className="rounded bg-white/6 px-1.5 py-0.5 text-[12px]">
                NEXT_PUBLIC_POSTHOG_KEY
              </code>{" "}
              and host{" "}
              <code className="rounded bg-white/6 px-1.5 py-0.5 text-[12px]">
                {POSTHOG_HOST}
              </code>
              .
            </p>
          </div>
          <Link
            href={projectUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center gap-2 rounded-pill bg-white px-5 py-3 text-sm font-semibold text-canvas transition hover:bg-white/90"
          >
            Open project ↗
          </Link>
        </div>
      </section>

      {POSTHOG_DASHBOARD_URL ? (
        <section className="rounded-3xl border border-white/8 bg-white/2 p-3 sm:p-4">
          <iframe
            src={POSTHOG_DASHBOARD_URL}
            title="PostHog dashboard"
            className="h-[800px] w-full rounded-2xl border border-white/8 bg-canvas"
            allowFullScreen
          />
        </section>
      ) : (
        <section className="rounded-3xl border border-dashed border-white/15 bg-white/1 p-8">
          <h2 className="text-lg font-semibold text-white">Embed a dashboard</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-(--mink-text-muted)">
            <li>
              In PostHog, open the dashboard you want to embed → ⋯ menu → <strong className="text-white">Share</strong>.
            </li>
            <li>
              Toggle <strong className="text-white">Public link</strong> on, copy the URL.
            </li>
            <li>
              Add it to your environment as{" "}
              <code className="rounded bg-white/6 px-1.5 py-0.5 text-[12px]">
                NEXT_PUBLIC_POSTHOG_DASHBOARD_URL
              </code>
              .
            </li>
            <li>
              Re-deploy. The dashboard will render here in an iframe.
            </li>
          </ol>
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <CategoryCard
          title="Acquisition"
          body="Where signups come from. Tracked via UTMs + page-view events."
        />
        <CategoryCard
          title="Activation"
          body="From landing → waitlist join → app install (deep link)."
        />
        <CategoryCard
          title="Retention"
          body="Cohorts of seekers and artists by first-visit week."
        />
      </section>
    </div>
  );
}

function CategoryCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1 text-xs text-(--mink-text-muted)">{body}</p>
    </div>
  );
}
