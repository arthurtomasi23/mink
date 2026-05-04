"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

export function LoginForm({
  next,
  initialError,
}: {
  next: string;
  initialError: string | null;
}) {
  const [state, formAction, pending] = useActionState<
    LoginState | undefined,
    FormData
  >(loginAction, initialError ? { ok: false, error: initialError } : undefined);

  const error = state && !state.ok ? state.error : null;

  return (
    <form action={formAction} className="mt-6 grid gap-4">
      <input type="hidden" name="next" value={next} />

      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@mink.app"
          className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-(--mink-brand) focus:outline-none focus:ring-2 focus:ring-[var(--mink-brand-a28,rgba(123,44,191,0.28))]"
        />
      </Field>

      <Field label="Password" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-(--mink-brand) focus:outline-none focus:ring-2 focus:ring-[var(--mink-brand-a28,rgba(123,44,191,0.28))]"
        />
      </Field>

      {error ? (
        <div
          role="alert"
          className="whitespace-pre-wrap rounded-xl border border-red-500/40 bg-red-500/8 p-3 text-sm text-red-200"
        >
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-pill bg-white px-5 py-3 text-sm font-semibold text-canvas transition hover:bg-white/90 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? (
          <>
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-canvas/30 border-t-canvas" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium text-(--mink-text-muted)"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
