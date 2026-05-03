import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /**
     * Run on every request *except*:
     *  - Next.js internals (_next/static, _next/image)
     *  - The favicon and other top-level static assets
     *  - API routes other than the dashboard's (the public waitlist
     *    endpoint doesn't need a session check on every call).
     */
    "/((?!_next/static|_next/image|favicon\\.svg|favicon\\.ico|apple-touch-icon\\.png|robots\\.txt|sitemap\\.xml|og\\.png|api/waitlist).*)",
  ],
};
