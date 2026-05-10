"use client";

import { useCallback, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/browser";

type Props = {
  next?: string;
};

/**
 * Sign in with Apple via Supabase OAuth (same `auth.users` as the mobile app).
 * Apple Developer + Supabase Auth → Providers must be configured.
 */
export function SignInWithApple({ next = "/dashboard" }: Props) {
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onClick = useCallback(async () => {
    setErr(null);
    setPending(true);
    try {
      const supabase = getBrowserSupabase();
      const origin = window.location.origin;
      const safeNext =
        next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
        },
      });
      if (error) setErr(error.message);
    } catch (e) {
      setErr((e as Error).message ?? "Apple sign-in failed.");
    } finally {
      setPending(false);
    }
  }, [next]);

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-pill border border-white/15 bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? (
          <>
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Opening Apple…
          </>
        ) : (
          <>
            <AppleGlyph />
            Continue with Apple
          </>
        )}
      </button>
      {err ? (
        <p className="text-center text-xs text-red-300" role="alert">
          {err}
        </p>
      ) : null}
    </div>
  );
}

function AppleGlyph() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}
