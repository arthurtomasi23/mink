import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Safe comparison helper: localhost vs Vercel should show the SAME
 * Supabase hostname if they’re meant to hit the same project.
 *
 * Values are intentionally non-sensitive (hostname only, no keys).
 */
export function GET() {
  let supabaseHost = "";
  try {
    supabaseHost = new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    ).hostname;
  } catch {
    supabaseHost = "(invalid NEXT_PUBLIC_SUPABASE_URL)";
  }

  const domain = process.env.AUTH_COOKIE_DOMAIN?.trim();

  return NextResponse.json(
    {
      supabaseHost,
      authCookieDomain: domain || null,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || null,
    },
    {
      headers: {
        "cache-control": "no-store",
      },
    },
  );
}
