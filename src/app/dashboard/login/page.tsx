import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

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
  const initialError =
    sp.error === "not_admin"
      ? "Your account doesn't have admin access."
      : null;
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
            Restricted to Mink team members. All sign-in attempts are logged.
          </p>

          <LoginForm
            next={sp.next ?? "/dashboard"}
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
