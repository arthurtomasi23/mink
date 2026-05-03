import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of the Mink app and website.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "May 3, 2026";

const TOC = [
  { id: "acceptance", label: "Acceptance" },
  { id: "eligibility", label: "Eligibility" },
  { id: "accounts", label: "Accounts" },
  { id: "user-content", label: "Your content" },
  { id: "acceptable-use", label: "Acceptable use" },
  { id: "ip-claims", label: "Intellectual property & DMCA" },
  { id: "subscriptions", label: "Subscriptions & founding offer" },
  { id: "termination", label: "Termination" },
  { id: "disclaimers", label: "Disclaimers" },
  { id: "liability", label: "Liability" },
  { id: "law", label: "Governing law" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      effectiveDate={EFFECTIVE_DATE}
      intro="These Terms of Service govern your use of the Mink mobile app, the mink.app website and any related services (the “Services”). By using the Services you agree to these Terms."
      toc={TOC}
    >
      <LegalSection id="acceptance" title="Acceptance of these terms">
        <p>
          By creating an account, joining the waitlist, or otherwise using the
          Services, you agree to be bound by these Terms and by our Privacy
          Policy. If you don&rsquo;t agree, please don&rsquo;t use the
          Services.
        </p>
      </LegalSection>

      <LegalSection id="eligibility" title="Eligibility">
        <p>
          You must be at least 13 years old (or the equivalent minimum age in
          your jurisdiction) to use Mink. By using the Services you represent
          and warrant that you meet this requirement and that all information
          you provide is accurate and current.
        </p>
      </LegalSection>

      <LegalSection id="accounts" title="Accounts and security">
        <p>
          You are responsible for keeping your account credentials safe and
          for all activity that happens under your account. Notify us
          immediately at{" "}
          <a
            href="mailto:security@mink.app"
            className="text-white underline underline-offset-4 hover:text-(--mink-brand)"
          >
            security@mink.app
          </a>{" "}
          if you suspect unauthorized access.
        </p>
      </LegalSection>

      <LegalSection id="user-content" title="Your content">
        <p>
          Mink lets you upload content (e.g. tattoo photos, profile
          information, collections, comments). You keep all ownership of your
          content. By uploading content to Mink, you grant us a worldwide,
          non-exclusive, royalty-free license to host, store, reproduce,
          modify (e.g. resize), and display that content solely to operate and
          improve the Services. This license ends when you remove your
          content, except to the extent it has already been shared with other
          users or where retention is required by law.
        </p>
        <p>
          You represent that you have all necessary rights to the content you
          upload (including, for artists, the rights to publish photographs of
          tattoos you have created), and that your content does not infringe
          anyone&rsquo;s rights.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>upload content that is illegal, infringing, hateful, harassing, sexually exploitative, or contains personal data of others without consent;</li>
          <li>impersonate another person or misrepresent your relationship with an artist or studio;</li>
          <li>scrape, copy or systematically extract content from the Services;</li>
          <li>attempt to interfere with the operation, security or integrity of the Services;</li>
          <li>use the Services to develop a competing product or to train AI models on Mink content without our written permission.</li>
        </ul>
      </LegalSection>

      <LegalSection id="ip-claims" title="Intellectual property & DMCA">
        <p>
          The Mink name, logo, app and website are owned by Mink. We respect
          intellectual property rights and respond to valid notices under the
          U.S. Digital Millennium Copyright Act (DMCA) and equivalent laws.
          To submit a notice, email{" "}
          <a
            href="mailto:legal@mink.app"
            className="text-white underline underline-offset-4 hover:text-(--mink-brand)"
          >
            legal@mink.app
          </a>{" "}
          with the URL of the content, your contact details, a description of
          the work, and a good-faith statement that the use is unauthorized.
        </p>
      </LegalSection>

      <LegalSection id="subscriptions" title="Subscriptions & the founding-artist offer">
        <p>
          Mink is currently free to use for tattoo seekers. The first 100
          verified tattoo artists who join Mink receive a three-month free
          period and a permanent founding-artist badge. After the free period,
          continued artist features may require a paid subscription, the
          terms and price of which will be clearly displayed before purchase.
        </p>
        <p>
          Subscriptions are billed through the Apple App Store. Apple&rsquo;s
          standard subscription terms apply, including auto-renewal and
          cancellation at least 24 hours before the end of the current
          period. You can manage and cancel your subscription at any time in
          your Apple ID settings.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="Suspension and termination">
        <p>
          We may suspend or terminate your access to the Services if you
          violate these Terms or if we are required to do so by law. You can
          delete your account at any time from inside the app or by emailing{" "}
          <a
            href="mailto:privacy@mink.app"
            className="text-white underline underline-offset-4 hover:text-(--mink-brand)"
          >
            privacy@mink.app
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="disclaimers" title="Disclaimers">
        <p>
          The Services are provided &ldquo;as is&rdquo; and &ldquo;as
          available.&rdquo; To the maximum extent permitted by law, Mink
          disclaims all warranties, express or implied, including warranties
          of merchantability, fitness for a particular purpose and
          non-infringement.
        </p>
        <p>
          Mink does not endorse any artist or studio listed on the Services.
          Decisions you make based on Mink content (including choosing an
          artist for a tattoo) are your own.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="Limitation of liability">
        <p>
          To the maximum extent permitted by law, Mink&rsquo;s aggregate
          liability arising from or relating to the Services will not exceed
          the greater of (a) the amounts you paid Mink in the 12 months
          before the claim and (b) US$50.
        </p>
      </LegalSection>

      <LegalSection id="law" title="Governing law">
        <p>
          These Terms are governed by the laws of the jurisdiction where Mink
          is established, without regard to conflict of law principles. Where
          mandatory consumer law in your country grants you stronger
          protections, those protections apply.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to these terms">
        <p>
          We may update these Terms from time to time. When we make material
          changes we will update the effective date and, where appropriate,
          notify you in-app or by email. Your continued use of the Services
          after the changes constitutes acceptance of the updated Terms.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          Questions about these Terms? Email{" "}
          <a
            href="mailto:legal@mink.app"
            className="text-white underline underline-offset-4 hover:text-(--mink-brand)"
          >
            legal@mink.app
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
