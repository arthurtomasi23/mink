import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "What cookies and similar technologies Mink uses on its website, why we use them, and how you can control them.",
  alternates: { canonical: "/cookies" },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "May 3, 2026";

const TOC = [
  { id: "what-are-cookies", label: "What are cookies?" },
  { id: "categories", label: "Categories we use" },
  { id: "list", label: "Cookies we set" },
  { id: "third-party", label: "Third-party cookies" },
  { id: "manage", label: "How to manage cookies" },
  { id: "do-not-track", label: "Do Not Track / GPC" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

export default function CookiesPage() {
  return (
    <LegalShell
      title="Cookie Policy"
      effectiveDate={EFFECTIVE_DATE}
      intro="This Cookie Policy explains how Mink uses cookies and similar technologies on the mink.app website. The Mink mobile app does not use HTTP cookies; relevant in-app data is described in our Privacy Policy."
      toc={TOC}
    >
      <LegalSection id="what-are-cookies" title="What are cookies?">
        <p>
          Cookies are small text files that a website places on your device to
          remember information about your visit. We also refer in this policy
          to similar technologies such as <strong>local storage</strong>,{" "}
          <strong>session storage</strong>, and <strong>pixels</strong>.
        </p>
        <p>
          Cookies can be &ldquo;first-party&rdquo; (set by Mink) or
          &ldquo;third-party&rdquo; (set by another company we use). They can
          also be &ldquo;session&rdquo; cookies (deleted when you close your
          browser) or &ldquo;persistent&rdquo; cookies (kept for a defined
          period).
        </p>
      </LegalSection>

      <LegalSection id="categories" title="Categories we use">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-white">Strictly necessary</strong> —
            required for the site to function (security, form submissions,
            consent storage). These are always on; you can&rsquo;t disable
            them and still use the site.
          </li>
          <li>
            <strong className="text-white">Analytics</strong> — help us
            understand how visitors use the site so we can improve it. Loaded
            only with your consent.
          </li>
          <li>
            <strong className="text-white">Marketing</strong> — measure the
            effectiveness of campaigns that bring people to Mink. Loaded only
            with your consent. We do not use cookies to build cross-site
            behavioral profiles for advertising and we do not sell your data.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="list" title="Cookies and storage we set">
        <CookieTable
          rows={[
            {
              name: "mink.cookieConsent.v1",
              type: "Local storage",
              purpose:
                "Remembers your cookie preferences so we don't show the banner on every visit.",
              duration: "Until cleared",
              category: "Strictly necessary",
            },
            {
              name: "__mink_session",
              type: "First-party cookie",
              purpose:
                "Maintains a secure session for waitlist submissions and CSRF protection.",
              duration: "Session",
              category: "Strictly necessary",
            },
            {
              name: "_va_*",
              type: "First-party cookie",
              purpose:
                "Aggregated, privacy-respecting page-view analytics. No cross-site tracking.",
              duration: "Up to 1 year",
              category: "Analytics (with consent)",
            },
            {
              name: "_ref",
              type: "First-party cookie",
              purpose:
                "Records the campaign / referrer that brought you to the site so we can measure marketing effectiveness.",
              duration: "30 days",
              category: "Marketing (with consent)",
            },
          ]}
        />
      </LegalSection>

      <LegalSection id="third-party" title="Third-party cookies">
        <p>
          We try to keep third-party tooling to a minimum. Where third parties
          load on the site (for example, our analytics provider when you have
          consented to analytics), they may set their own cookies under their
          own privacy policies. We will list any active third parties here as
          they are introduced; today, no third-party cookies are set unless
          you opt into the corresponding category.
        </p>
      </LegalSection>

      <LegalSection id="manage" title="How to manage cookies">
        <p>
          You can manage cookies in three ways:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-white">Our consent banner</strong> —
            shown the first time you visit. Choose &ldquo;Accept all&rdquo;,
            &ldquo;Reject non-essential&rdquo;, or &ldquo;Customize&rdquo;.
            Your choice is remembered locally on your device.
          </li>
          <li>
            <strong className="text-white">Reset your preferences</strong> —
            clear your browser&rsquo;s site data for{" "}
            <code className="rounded bg-white/6 px-1.5 py-0.5 text-[12px] text-white">
              mink.app
            </code>{" "}
            to be shown the banner again.
          </li>
          <li>
            <strong className="text-white">Browser controls</strong> — every
            modern browser lets you block or delete cookies. Note that
            blocking strictly-necessary cookies may break parts of the site
            (e.g. waitlist submissions).
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="do-not-track" title="Do Not Track and Global Privacy Control">
        <p>
          Mink honors the{" "}
          <a
            href="https://globalprivacycontrol.org/"
            className="text-white underline underline-offset-4 hover:text-(--mink-brand)"
            rel="noopener noreferrer"
            target="_blank"
          >
            Global Privacy Control (GPC)
          </a>{" "}
          signal. If your browser sends GPC, we treat it as an opt-out of
          analytics and marketing cookies, and as an opt-out of any sale or
          sharing of personal information for cross-context behavioral
          advertising under U.S. state privacy laws (we already do not sell
          or share for that purpose).
        </p>
        <p>
          The legacy &ldquo;Do Not Track&rdquo; HTTP header has no agreed
          industry meaning, but where we can detect it we treat it the same
          way as GPC.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to this policy">
        <p>
          We may update this Cookie Policy when we add or remove tooling.
          Material changes will be reflected in the effective date at the top
          of the page; you can re-open the consent banner at any time by
          clearing site data for mink.app.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          Questions about this Cookie Policy? Email{" "}
          <a
            href="mailto:privacy@mink.app"
            className="text-white underline underline-offset-4 hover:text-(--mink-brand)"
          >
            privacy@mink.app
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}

function CookieTable({
  rows,
}: {
  rows: {
    name: string;
    type: string;
    purpose: string;
    duration: string;
    category: string;
  }[];
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-white/8">
      <div className="hidden grid-cols-12 gap-4 bg-white/4 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-(--mink-text-muted) md:grid">
        <div className="col-span-3">Name</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-4">Purpose</div>
        <div className="col-span-1">Duration</div>
        <div className="col-span-2">Category</div>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.name}
          className={`grid grid-cols-1 gap-2 px-5 py-4 text-sm md:grid-cols-12 md:gap-4 ${
            i % 2 === 0 ? "bg-white/2" : ""
          }`}
        >
          <div className="md:col-span-3">
            <code className="rounded bg-white/6 px-1.5 py-0.5 text-[12px] text-white">
              {r.name}
            </code>
          </div>
          <div className="text-(--mink-text-muted) md:col-span-2">
            {r.type}
          </div>
          <div className="text-(--mink-text-muted) md:col-span-4">
            {r.purpose}
          </div>
          <div className="text-(--mink-text-muted) md:col-span-1">
            {r.duration}
          </div>
          <div className="md:col-span-2">
            <span className="inline-flex items-center rounded-pill border border-white/10 bg-white/3 px-2 py-0.5 text-xs font-medium text-white/85">
              {r.category}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
