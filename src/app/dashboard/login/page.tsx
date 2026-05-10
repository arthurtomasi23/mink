import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LoginForm } from "./LoginForm";
import { SignInWithApple } from "./SignInWithApple";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

type SP = Promise<{ next?: string; error?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const next = sp.next ?? "/dashboard";

  const initialError = (() => {
    switch (sp.error) {
      case "not_admin":
        return "Your account signed in successfully but isn’t authorized for this dashboard.";
      case "config":
        return "Dashboard isn't fully configured yet (missing Supabase env vars). Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in Vercel → Settings → Environment Variables, then redeploy.";
      case "transient":
        return "We couldn't reach Supabase just now. Please try again in a moment.";
      case "oauth":
        return (
          "Apple or Google redirect failed. Add this exact redirect URL under Supabase → Authentication → URL configuration:\n\n" +
          `${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "(your deployed origin)"}/auth/callback\n\n` +
          "Include `http://localhost:3000/auth/callback` for local dev."
        );
      default:
        return null;
    }
  })();
  return (
    <main className="relative grid min-h-screen place-items-center px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div
          className="absolute left-1/2 top-1/3 h-[600px] w-[700px] -translate-x-1/2 -translate-y-1/2 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(123,44,191,0.22), transparent 60%)",
          }}
        />
      </div>

      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-8 rounded-3xl border border-white/10 bg-surface/80 p-7 backdrop-blur-md sm:p-9">
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm text-(--mink-text-muted)">
            Restricted area. Uses the same Supabase project as the Mink mobile app —
            Sign in with Apple or email/password.
          </p>

          <div className="mt-7">
            <SignInWithApple next={next} />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-surface/80 px-3 text-(--mink-text-muted)">
                or email
              </span>
            </div>
          </div>

          <LoginForm
            next={next}
            initialError={initialError}
          />
        </div>

        <p className="mt-6 text-center text-xs text-(--mink-text-faint,#6a6a70)">
          <Link href="/" className="hover:text-white">
            ← Back to mink.app
          </Link>
        </p>
      </div>
    </main>
  );
}
