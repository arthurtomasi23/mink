"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "mink.cookieConsent.v1";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        // Defer slightly to avoid layout shift on first paint
        const t = setTimeout(() => setOpen(true), 600);
        return () => clearTimeout(t);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  function persist(next: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("mink:consent", { detail: next }));
    } catch {
      // ignore
    }
    setOpen(false);
    setShowPrefs(false);
  }

  function acceptAll() {
    persist({
      necessary: true,
      analytics: true,
      marketing: true,
      decidedAt: new Date().toISOString(),
    });
  }

  function rejectAll() {
    persist({
      necessary: true,
      analytics: false,
      marketing: false,
      decidedAt: new Date().toISOString(),
    });
  }

  function savePrefs() {
    persist({
      necessary: true,
      analytics,
      marketing,
      decidedAt: new Date().toISOString(),
    });
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-3 sm:px-6 sm:pb-6"
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-surface/95 p-5 shadow-2xl backdrop-blur-xl sm:p-6"
        style={{
          boxShadow:
            "0 30px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {!showPrefs ? (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-base font-semibold text-white">
                We respect your privacy
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-(--mink-text-muted)">
                We use a small number of cookies to keep this site secure and
                understand how it&apos;s used. You can accept all, reject
                non-essential cookies, or fine-tune your choices. Read more in
                our{" "}
                <Link
                  href="/cookies"
                  className="text-white underline underline-offset-4 hover:text-(--mink-brand)"
                >
                  Cookie Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-white underline underline-offset-4 hover:text-(--mink-brand)"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => setShowPrefs(true)}
                className="rounded-pill border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white transition hover:bg-white/5"
              >
                Customize
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="rounded-pill border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white transition hover:bg-white/5"
              >
                Reject non-essential
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-pill bg-white px-5 py-2 text-sm font-semibold text-surface transition hover:bg-white/90"
              >
                Accept all
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-base font-semibold text-white">
                Cookie preferences
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-(--mink-text-muted)">
                Choose which cookies to allow. You can change these at any time
                from the footer.
              </p>
            </div>

            <div className="grid gap-3">
              <PrefRow
                label="Strictly necessary"
                description="Required for the site to function — security, signup form submission, consent storage. Cannot be disabled."
                checked
                disabled
              />
              <PrefRow
                label="Analytics"
                description="Aggregated, privacy-respecting traffic measurement so we can improve the site. No cross-site tracking."
                checked={analytics}
                onChange={setAnalytics}
              />
              <PrefRow
                label="Marketing"
                description="Used to measure the effectiveness of campaigns that bring people to Mink. We do not sell your data."
                checked={marketing}
                onChange={setMarketing}
              />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => setShowPrefs(false)}
                className="rounded-pill border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white transition hover:bg-white/5"
              >
                Back
              </button>
              <button
                type="button"
                onClick={savePrefs}
                className="rounded-pill bg-(--mink-brand) px-5 py-2 text-sm font-semibold text-white transition hover:bg-(--mink-brand-600)"
              >
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PrefRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
}) {
  return (
    <label
      className={`flex items-start gap-3 rounded-xl border border-white/5 bg-white/2 p-3 ${
        disabled ? "opacity-80" : "cursor-pointer hover:bg-white/4"
      }`}
    >
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-(--mink-brand)"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <div className="flex-1">
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="mt-0.5 text-xs leading-relaxed text-(--mink-text-muted)">
          {description}
        </div>
      </div>
    </label>
  );
}
