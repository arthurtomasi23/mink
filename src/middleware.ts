import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only run middleware where it's actually needed: the dashboard.
  // The landing page, legal pages, and public APIs don't need session
  // refresh on every request — keeping the matcher narrow means a
  // misconfigured Supabase env can never take the whole site down.
  matcher: ["/dashboard/:path*"],
};
