import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeRelativePath(raw: string | null): string {
  const next = raw ?? "/dashboard";
  if (!next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}

/**
 * OAuth / PKCE return handler (Apple, Google, magic link…).
 * Add this URL (+ localhost) under Supabase Auth → URL configuration → Redirect URLs.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeRelativePath(url.searchParams.get("next"));

  const supabase = await getServerSupabase();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      let origin = url.origin;
      if (!isLocalEnv && forwardedHost) {
        const proto = request.headers.get("x-forwarded-proto") ?? "https";
        origin = `${proto}://${forwardedHost}`;
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  let failOrigin = url.origin;
  if (process.env.NODE_ENV !== "development" && forwardedHost) {
    const proto = request.headers.get("x-forwarded-proto") ?? "https";
    failOrigin = `${proto}://${forwardedHost}`;
  }
  return NextResponse.redirect(`${failOrigin}/dashboard/login?error=oauth`);
}
