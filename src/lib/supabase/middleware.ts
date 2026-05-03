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

  // Resolve env defensively. If Supabase isn't configured (e.g. the
  // first deploy on Vercel before env vars are set), don't crash the
  // request — bounce dashboard traffic to the login page with an error
  // and let everything else through.
  let supabaseUrl: string;
  let supabaseAnonKey: string;
  try {
    supabaseUrl = supabaseEnv.url();
    supabaseAnonKey = supabaseEnv.anonKey();
  } catch (err) {
    console.error(
      "[middleware] Supabase env not configured:",
      (err as Error).message,
    );
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      const redirect = request.nextUrl.clone();
      redirect.pathname = "/dashboard/login";
      redirect.search = "?error=config";
      return NextResponse.redirect(redirect);
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
  });

  const reqUrl = request.nextUrl;
  const isDashboard = reqUrl.pathname.startsWith("/dashboard");
  const isLogin = reqUrl.pathname === "/dashboard/login";

  // If anything below throws (network blip, Supabase down, malformed
  // cookie), don't return a 500 — fail closed for /dashboard/* by
  // sending the user to the login page, and fail open everywhere else.
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (isDashboard && !isLogin) {
      if (!user) {
        const redirect = reqUrl.clone();
        redirect.pathname = "/dashboard/login";
        redirect.searchParams.set("next", reqUrl.pathname);
        return NextResponse.redirect(redirect);
      }

      // Cheap admin check at the edge. The dashboard layout double-checks
      // server-side as defense in depth.
      const { data: isAdmin, error } = await supabase.rpc("is_admin", {
        uid: user.id,
      } as never);
      if (error || isAdmin !== true) {
        const redirect = reqUrl.clone();
        redirect.pathname = "/dashboard/login";
        redirect.searchParams.set("error", "not_admin");
        return NextResponse.redirect(redirect);
      }
    }

    if (isLogin && user) {
      const { data: isAdmin } = await supabase.rpc("is_admin", {
        uid: user.id,
      } as never);
      if (isAdmin === true) {
        const redirect = reqUrl.clone();
        redirect.pathname = "/dashboard";
        redirect.search = "";
        return NextResponse.redirect(redirect);
      }
    }
  } catch (err) {
    console.error("[middleware] Supabase call failed:", err);
    if (isDashboard && !isLogin) {
      const redirect = reqUrl.clone();
      redirect.pathname = "/dashboard/login";
      redirect.searchParams.set("error", "transient");
      return NextResponse.redirect(redirect);
    }
  }

  return response;
}
