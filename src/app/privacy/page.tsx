import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Mink collects, uses, shares and protects your personal information across our app, website and services.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "May 3, 2026";

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "controller", label: "Who we are" },
  { id: "data-we-collect", label: "Data we collect" },
  { id: "how-we-use", label: "How we use data" },
  { id: "legal-bases", label: "Legal bases (GDPR)" },
  { id: "sharing", label: "How we share data" },
  { id: "tracking", label: "Tracking & ATT" },
  { id: "retention", label: "Data retention" },
  { id: "rights", label: "Your rights" },
  { id: "ccpa", label: "U.S. state rights (CCPA/CPRA)" },
  { id: "children", label: "Children" },
  { id: "international", label: "International transfers" },
  { id: "security", label: "Security" },
  { id: "changes", label: "Changes to this policy" },
  { id: "contact", label: "Contact us" },
];

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      effectiveDate={EFFECTIVE_DATE}
      intro="Mink is built around discovery, not surveillance. This Privacy Policy explains what information we collect when you use the Mink mobile app, the mink.app website and any related services (together, the “Services”), how we use it, who we share it with, and the choices you have. It is written to comply with the Apple App Store Review Guidelines (including §5.1) and applicable privacy laws such as the EU/UK GDPR and the California Consumer Privacy Act (CCPA/CPRA)."
      toc={TOC}
    >
      <LegalSection id="overview" title="Overview">
        <p>
          We collect the minimum information needed to provide a high-quality
          tattoo discovery experience: an account so you can save what you
          love, the content you publish or save, and limited diagnostic data so
          we can keep the app running. We do <strong>not</strong> sell your
          personal information, and we do <strong>not</strong> track you
          across other companies&rsquo; apps or websites for advertising.
        </p>
        <p>
          You can request a copy of your data or delete your account from
          inside the app at any time. If you have any questions, write to{" "}
          <a
            href="mailto:privacy@mink.app"
            className="text-white underline underline-offset-4 hover:text-(--mink-brand)"
          >
            privacy@mink.app
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="controller" title="Who we are (data controller)">
        <p>
          Mink (&ldquo;<strong>Mink</strong>,&rdquo; &ldquo;<strong>we</strong>
          ,&rdquo; &ldquo;<strong>us</strong>,&rdquo; &ldquo;
          <strong>our</strong>&rdquo;) is the controller of your personal
          information processed via the Services. You can reach our privacy
          team at{" "}
          <a
            href="mailto:privacy@mink.app"
            className="text-white underline underline-offset-4 hover:text-(--mink-brand)"
          >
            privacy@mink.app
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="data-we-collect" title="Data we collect">
        <p>
          The categories below mirror Apple&rsquo;s App Privacy &ldquo;Data
          Types&rdquo; framework so they map directly onto our App Store
          privacy nutrition label.
        </p>

        <DataTable
          rows={[
            {
              category: "Contact info",
              items: "Email address (required to create an account)",
              purpose: "Account creation, login, security, service emails",
              linked: "Yes",
            },
            {
              category: "Identifiers",
              items:
                "User ID (assigned by us), Sign in with Apple identifier (if used)",
              purpose: "Authentication, abuse prevention",
              linked: "Yes",
            },
            {
              category: "User content",
              items:
                "Photos you upload (artists), tattoos you save into collections, follows, profile bio, studio name and links",
              purpose: "Provide core app functionality",
              linked: "Yes",
            },
            {
              category: "Search content",
              items:
                "Text and image queries you submit to search; AI-generated descriptions of your reference photos",
              purpose:
                "Returning relevant tattoos; improving search quality (in aggregate)",
              linked: "Yes",
            },
            {
              category: "Usage data",
              items:
                "App interactions (e.g. tabs opened, feed scrolls, taps) and crash logs",
              purpose: "Analytics, debugging, product improvement",
              linked: "Yes",
            },
            {
              category: "Diagnostics",
              items:
                "Crash data, performance data, device type, OS version, app version, language, region",
              purpose: "Stability and compatibility",
              linked: "No",
            },
            {
              category: "Coarse location",
              items:
                "Approximate location (city level) inferred from IP, only if you allow city-based discovery features",
              purpose: "Show nearby artists / tattoos",
              linked: "Yes",
            },
          ]}
        />

        <p className="mt-4">
          We do <strong>not</strong> collect: precise GPS location, contacts,
          health/fitness data, financial information, or sensitive personal
          information. Mink does <strong>not</strong> use your data for
          third-party advertising and does <strong>not</strong> implement the
          App Tracking Transparency &ldquo;tracking&rdquo; behavior as defined
          by Apple.
        </p>
      </LegalSection>

      <LegalSection id="how-we-use" title="How we use your data">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-white">Provide the Services:</strong>{" "}
            authenticate you, show you a personalized feed, store your
            collections, deliver search results, and let artists publish work.
          </li>
          <li>
            <strong className="text-white">Image search:</strong> reference
            photos you upload are processed by a vision model to extract
            descriptive tags (style, motif, technique). These tags are matched
            against publicly published tattoo metadata in our gallery.
          </li>
          <li>
            <strong className="text-white">Communicate with you:</strong> send
            essential service emails (account, security, important updates)
            and, with your consent, occasional product updates.
          </li>
          <li>
            <strong className="text-white">Improve the product:</strong>{" "}
            understand how features are used, fix bugs, prevent abuse and
            improve recommendations.
          </li>
          <li>
            <strong className="text-white">Comply with the law:</strong> meet
            our legal, tax and regulatory obligations and respond to lawful
            requests.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="legal-bases" title="Legal bases for processing (GDPR / UK GDPR)">
        <p>
          If you are in the EEA, the UK or Switzerland, we rely on the
          following legal bases:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-white">Contract</strong> — to create and
            operate your account and provide the Services.
          </li>
          <li>
            <strong className="text-white">Legitimate interests</strong> — to
            keep the Services secure, prevent abuse, debug and improve the
            product, and to send essential service messages. You may object to
            processing based on legitimate interests at any time.
          </li>
          <li>
            <strong className="text-white">Consent</strong> — for non-essential
            cookies, optional analytics and marketing emails. You can withdraw
            your consent at any time without affecting the lawfulness of
            processing before withdrawal.
          </li>
          <li>
            <strong className="text-white">Legal obligation</strong> — when we
            need to comply with applicable laws.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="sharing" title="How we share data">
        <p>
          We share personal information only with service providers
          (&ldquo;processors&rdquo;) who help us run the Services and only to
          the extent necessary to do so. Current categories include:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-white">Cloud &amp; database</strong>{" "}
            (Supabase) — authentication, user profiles, tattoos, bookmarks and
            collections storage.
          </li>
          <li>
            <strong className="text-white">Hosting / CDN</strong> for the
            mink.app website and image delivery.
          </li>
          <li>
            <strong className="text-white">Email delivery</strong> for
            transactional and waitlist messages.
          </li>
          <li>
            <strong className="text-white">Crash &amp; performance</strong>{" "}
            tooling for debugging.
          </li>
          <li>
            <strong className="text-white">Vision AI provider</strong> for
            describing reference photos you submit to image search.
          </li>
        </ul>
        <p>
          We may also share information (i) to comply with valid legal process,
          (ii) to enforce our Terms or protect the rights, property or safety
          of Mink, our users or others, and (iii) in the context of a merger,
          acquisition or sale of assets — in which case we will notify you in
          advance.
        </p>
        <p>
          We do <strong>not</strong> sell your personal information and we do{" "}
          <strong>not</strong> share it with third parties for cross-context
          behavioral advertising.
        </p>
      </LegalSection>

      <LegalSection
        id="tracking"
        title="Tracking & App Tracking Transparency"
      >
        <p>
          Per Apple&rsquo;s App Store Review Guidelines (§5.1.2), &ldquo;
          tracking&rdquo; refers to linking user or device data collected from
          our app with user or device data collected from other companies&rsquo;
          apps, websites or offline properties for targeted advertising or
          measurement purposes, or sharing user or device data with data
          brokers. <strong>Mink does not engage in tracking.</strong> For this
          reason we do not present an App Tracking Transparency prompt.
        </p>
        <p>
          If we ever introduce a feature that constitutes tracking, we will
          update this policy and present the system ATT permission prompt
          before any such tracking begins.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="Data retention">
        <p>
          We keep your personal information for as long as your account is
          active or as needed to provide the Services. When you delete your
          account, we delete your profile, your collections and your published
          content within <strong>30 days</strong>, except where we are required
          to retain certain data for legal, security or fraud-prevention
          purposes (e.g. abuse logs, financial records). Aggregated and
          de-identified data may be retained for longer.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="Your rights">
        <p>
          Depending on where you live, you may have the following rights with
          respect to your personal information:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-white">Access</strong> — request a copy of
            the personal information we hold about you.
          </li>
          <li>
            <strong className="text-white">Rectification</strong> — ask us to
            correct inaccurate or incomplete information.
          </li>
          <li>
            <strong className="text-white">Deletion</strong> — request that we
            delete your personal information (also offered in-app, in
            compliance with App Store Guideline §5.1.1(v)).
          </li>
          <li>
            <strong className="text-white">Restriction / Objection</strong> —
            ask us to restrict or object to processing based on legitimate
            interests.
          </li>
          <li>
            <strong className="text-white">Portability</strong> — receive a
            copy of your data in a structured, machine-readable format.
          </li>
          <li>
            <strong className="text-white">Withdraw consent</strong> — at any
            time, where processing is based on consent.
          </li>
          <li>
            <strong className="text-white">Lodge a complaint</strong> — with
            your local data protection authority. We&rsquo;d appreciate the
            chance to address your concern first.
          </li>
        </ul>
        <p>
          You can exercise any of these rights by emailing{" "}
          <a
            href="mailto:privacy@mink.app"
            className="text-white underline underline-offset-4 hover:text-(--mink-brand)"
          >
            privacy@mink.app
          </a>{" "}
          or by using the in-app account deletion flow. We will respond within
          the timeframes required by applicable law.
        </p>
      </LegalSection>

      <LegalSection id="ccpa" title="Notice for California residents (CCPA / CPRA)">
        <p>
          In the past 12 months, Mink has collected the categories of personal
          information described above (Identifiers, Customer Records, Internet
          / network activity, Inferences, and Audio/Visual content uploaded by
          users). We have not <strong>sold</strong> or <strong>shared</strong>{" "}
          personal information for cross-context behavioral advertising as
          those terms are defined by the CCPA/CPRA.
        </p>
        <p>
          California residents have the right to (i) know what personal
          information we collect, use and disclose; (ii) request deletion of
          personal information; (iii) request correction of inaccurate
          personal information; (iv) opt out of any future sale or sharing of
          personal information; and (v) not be discriminated against for
          exercising these rights. To exercise your rights, contact{" "}
          <a
            href="mailto:privacy@mink.app"
            className="text-white underline underline-offset-4 hover:text-(--mink-brand)"
          >
            privacy@mink.app
          </a>
          . We will verify your request using the email associated with your
          account.
        </p>
      </LegalSection>

      <LegalSection id="children" title="Children">
        <p>
          Mink is not directed to children under <strong>13</strong> (or under
          the equivalent minimum age in your jurisdiction). We do not knowingly
          collect personal information from children. If you believe we have
          collected information from a child, please contact us at{" "}
          <a
            href="mailto:privacy@mink.app"
            className="text-white underline underline-offset-4 hover:text-(--mink-brand)"
          >
            privacy@mink.app
          </a>{" "}
          and we will delete it.
        </p>
      </LegalSection>

      <LegalSection id="international" title="International data transfers">
        <p>
          Where personal information is transferred outside your country
          (including outside the EEA, the UK or Switzerland), we rely on
          appropriate safeguards such as the European Commission&rsquo;s
          Standard Contractual Clauses or other recognized transfer
          mechanisms.
        </p>
      </LegalSection>

      <LegalSection id="security" title="Security">
        <p>
          We use industry-standard administrative, technical and physical
          safeguards to protect personal information, including encryption in
          transit (HTTPS), encryption at rest for our database, and strict
          access controls. No method of transmission or storage is 100%
          secure, however; if you discover a vulnerability, please contact{" "}
          <a
            href="mailto:security@mink.app"
            className="text-white underline underline-offset-4 hover:text-(--mink-brand)"
          >
            security@mink.app
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. When we make
          material changes we will update the effective date at the top of
          this page and, where appropriate, notify you in-app or by email. The
          version published on this page is always the current one.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact us">
        <p>
          For any questions about this Privacy Policy or our data practices,
          contact:
        </p>
        <p>
          <strong className="text-white">Mink — Privacy Team</strong>
          <br />
          Email:{" "}
          <a
            href="mailto:privacy@mink.app"
            className="text-white underline underline-offset-4 hover:text-(--mink-brand)"
          >
            privacy@mink.app
          </a>
        </p>
      </LegalSection>
    </LegalShell>
  );
}

function DataTable({
  rows,
}: {
  rows: {
    category: string;
    items: string;
    purpose: string;
    linked: string;
  }[];
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-white/8">
      <div className="hidden grid-cols-12 gap-4 bg-white/4 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-(--mink-text-muted) md:grid">
        <div className="col-span-3">Category</div>
        <div className="col-span-4">Examples</div>
        <div className="col-span-3">Purpose</div>
        <div className="col-span-2">Linked to you?</div>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.category}
          className={`grid grid-cols-1 gap-2 px-5 py-4 text-sm md:grid-cols-12 md:gap-4 ${
            i % 2 === 0 ? "bg-white/2" : ""
          }`}
        >
          <div className="font-semibold text-white md:col-span-3">
            {r.category}
          </div>
          <div className="text-(--mink-text-muted) md:col-span-4">
            {r.items}
          </div>
          <div className="text-(--mink-text-muted) md:col-span-3">
            {r.purpose}
          </div>
          <div className="md:col-span-2">
            <span
              className={`inline-flex items-center rounded-pill px-2 py-0.5 text-xs font-medium ${
                r.linked === "Yes"
                  ? "border border-(--mink-brand-a60) bg-(--mink-brand-a18) text-white"
                  : "border border-white/10 bg-white/3 text-(--mink-text-muted)"
              }`}
            >
              {r.linked}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
