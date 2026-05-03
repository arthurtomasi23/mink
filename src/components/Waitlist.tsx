"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionEyebrow } from "./Features";
import { trackEvent } from "./PostHogProvider";

type Role = "seeker" | "artist";

type SubmitState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; spot?: number | null }
  | { kind: "error"; message: string };

export function Waitlist() {
  const [role, setRole] = useState<Role>("seeker");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [instagram, setInstagram] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setState({
        kind: "error",
        message:
          "Please agree to our Privacy Policy so we can email you when Mink is ready.",
      });
      return;
    }
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          email,
          name: name || undefined,
          city: city || undefined,
          instagram: instagram || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        spot?: number | null;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      trackEvent("waitlist_joined", {
        role,
        founding: role === "artist" && (data.spot ?? 9999) <= 100,
        artist_spot: data.spot ?? null,
      });
      setState({ kind: "success", spot: data.spot ?? null });
    } catch (err) {
      setState({
        kind: "error",
        message:
          err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  return (
    <section
      id="waitlist"
      className="relative scroll-mt-28 py-24 sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-90"
        aria-hidden
      >
        <div
          className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(123,44,191,0.22), transparent 60%)",
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-white/4 to-white/1 p-6 backdrop-blur-md sm:p-10">
          <div className="text-center">
            <div className="flex justify-center">
              <SectionEyebrow>Early access</SectionEyebrow>
            </div>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Be one of the first to use Mink.
            </h2>
            <p className="mt-3 text-sm text-(--mink-text-muted) sm:text-base">
              Drop your email below. We&rsquo;ll send you an early access invite
              when Mink launches on the App Store.
            </p>
          </div>

          {/* Role toggle */}
          <div className="mx-auto mt-8 flex w-full max-w-xs items-center rounded-pill border border-white/10 bg-white/3 p-1">
            <RoleToggle
              active={role === "seeker"}
              onClick={() => setRole("seeker")}
            >
              Tattoo seeker
            </RoleToggle>
            <RoleToggle
              active={role === "artist"}
              onClick={() => setRole("artist")}
            >
              Artist
            </RoleToggle>
          </div>

          {state.kind === "success" ? (
            <SuccessCard role={role} spot={state.spot ?? null} />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 grid w-full max-w-2xl grid-cols-1 gap-4"
              noValidate
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Email"
                  htmlFor="email"
                  required
                >
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-(--mink-brand) focus:outline-none focus:ring-2 focus:ring-[var(--mink-brand-a28,rgba(123,44,191,0.28))]"
                  />
                </Field>

                <Field
                  label={role === "artist" ? "Studio / artist name" : "Name (optional)"}
                  htmlFor="name"
                >
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === "artist" ? "Studio Lune" : "Your name"}
                    className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-(--mink-brand) focus:outline-none focus:ring-2 focus:ring-[var(--mink-brand-a28,rgba(123,44,191,0.28))]"
                  />
                </Field>
              </div>

              {role === "artist" ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="City" htmlFor="city">
                    <input
                      id="city"
                      type="text"
                      autoComplete="address-level2"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Lisbon"
                      className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-(--mink-brand) focus:outline-none focus:ring-2 focus:ring-[var(--mink-brand-a28,rgba(123,44,191,0.28))]"
                    />
                  </Field>
                  <Field label="Instagram (optional)" htmlFor="instagram">
                    <input
                      id="instagram"
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@studio.lune"
                      className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-(--mink-brand) focus:outline-none focus:ring-2 focus:ring-[var(--mink-brand-a28,rgba(123,44,191,0.28))]"
                    />
                  </Field>
                </div>
              ) : null}

              <label className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/2 p-3">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-(--mink-brand)"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span className="text-xs leading-relaxed text-(--mink-text-muted)">
                  I agree to receive launch updates from Mink and have read the{" "}
                  <Link
                    href="/privacy"
                    className="text-white underline underline-offset-4 hover:text-(--mink-brand)"
                  >
                    Privacy Policy
                  </Link>
                  . You can unsubscribe at any time.
                </span>
              </label>

              {state.kind === "error" ? (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/40 bg-red-500/8 p-3 text-sm text-red-200"
                >
                  {state.message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={state.kind === "loading"}
                className="inline-flex items-center justify-center gap-2 rounded-pill bg-white px-6 py-3.5 text-sm font-semibold text-canvas shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] transition hover:bg-white/90 disabled:cursor-wait disabled:opacity-60"
              >
                {state.kind === "loading" ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-canvas/30 border-t-canvas" />
                    Submitting…
                  </>
                ) : role === "artist" ? (
                  "Claim a founding spot"
                ) : (
                  "Get early access"
                )}
              </button>

              <p className="text-center text-[11px] text-(--mink-text-faint,#6a6a70)">
                We&rsquo;ll only email you about Mink. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function RoleToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-pill px-3 py-2 text-xs font-semibold transition sm:text-sm ${
        active
          ? "bg-white text-canvas"
          : "text-white/70 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium text-(--mink-text-muted)"
      >
        {label}
        {required ? <span className="text-(--mink-brand)"> *</span> : null}
      </label>
      {children}
    </div>
  );
}

function SuccessCard({
  role,
  spot,
}: {
  role: Role;
  spot: number | null;
}) {
  return (
    <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-(--mink-brand-a60) bg-(--mink-brand-a10) p-6 text-center">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-(--mink-brand) text-white">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">
        {role === "artist" && spot && spot <= 100
          ? `You’re founding artist #${spot}.`
          : "You’re on the list."}
      </h3>
      <p className="mt-2 text-sm text-(--mink-text-muted)">
        {role === "artist" && spot && spot <= 100
          ? "We’ll email you with onboarding details before public launch — your three free months start when you go live."
          : "We’ll email you the moment Mink hits the App Store. Talk soon."}
      </p>
    </div>
  );
}
