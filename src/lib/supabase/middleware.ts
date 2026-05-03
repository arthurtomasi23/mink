import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "./env";

/**
 * Run on every request that matches the middleware matcher. It
 *  1. refreshes the Supabase auth cookies if they're about to expire,
 *  2. blocks unauthenticated/non-admin access to /dashboard/*.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseEnv.url(),
    supabaseEnv.anonKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Touching getUser() refreshes the session if needed
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl;
  const isDashboard = url.pathname.startsWith("/dashboard");
  const isLogin = url.pathname === "/dashboard/login";

  if (isDashboard && !isLogin) {
    if (!user) {
      const redirect = url.clone();
      redirect.pathname = "/dashboard/login";
      redirect.searchParams.set("next", url.pathname);
      return NextResponse.redirect(redirect);
    }

    // Cheap admin check at the edge. The dashboard layout double-checks
    // server-side as defense in depth.
    const { data: isAdmin, error } = await supabase.rpc("is_admin", {
      uid: user.id,
    } as never);
    if (error || isAdmin !== true) {
      const redirect = url.clone();
      redirect.pathname = "/dashboard/login";
      redirect.searchParams.set("error", "not_admin");
      return NextResponse.redirect(redirect);
    }
  }

  if (isLogin && user) {
    // Already signed in — bounce to the dashboard if they're an admin.
    const { data: isAdmin } = await supabase.rpc("is_admin", {
      uid: user.id,
    } as never);
    if (isAdmin === true) {
      const redirect = url.clone();
      redirect.pathname = "/dashboard";
      redirect.search = "";
      return NextResponse.redirect(redirect);
    }
  }

  return response;
}
