import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "./env";
import { supabaseAuthCookieOptions } from "./auth-cookies";

/**
 * Refreshes the Supabase session where cookies are wired, and gates
 * `/dashboard/*` (except `/dashboard/login`, `/dashboard/unauthorized`,
 * `/auth/callback`).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

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
    const path = request.nextUrl.pathname;
    const isLoginPath = path === "/dashboard/login";
    const isUnauthorizedPath = path === "/dashboard/unauthorized";
    if (path.startsWith("/dashboard") && !isLoginPath && !isUnauthorizedPath) {
      const redirect = request.nextUrl.clone();
      redirect.pathname = "/dashboard/login";
      redirect.search = "?error=config";
      return NextResponse.redirect(redirect);
    }
    return response;
  }

  const cookieOpts = supabaseAuthCookieOptions();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    ...(cookieOpts ? { cookieOptions: cookieOpts } : {}),
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, responseHeaders) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        const headersObj = responseHeaders ?? {};
        for (const [key, value] of Object.entries(headersObj)) {
          response.headers.set(key, value);
        }
      },
    },
  });

  const reqUrl = request.nextUrl;
  const path = reqUrl.pathname;
  const isDashboard = path.startsWith("/dashboard");
  const isLogin = path === "/dashboard/login";
  const isUnauthorized = path === "/dashboard/unauthorized";

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (isDashboard && !isLogin && !isUnauthorized) {
      if (!user) {
        const redirect = reqUrl.clone();
        redirect.pathname = "/dashboard/login";
        redirect.searchParams.set("next", path);
        return NextResponse.redirect(redirect);
      }

      const { data: isAdmin, error } = await supabase.rpc("is_admin", {
        uid: user.id,
      } as never);
      if (error || isAdmin !== true) {
        const redirect = reqUrl.clone();
        redirect.pathname = "/dashboard/unauthorized";
        redirect.search = "";
        return NextResponse.redirect(redirect);
      }
    }

    if (isUnauthorized) {
      if (!user) {
        const redirect = reqUrl.clone();
        redirect.pathname = "/dashboard/login";
        redirect.searchParams.set("next", "/dashboard");
        return NextResponse.redirect(redirect);
      }
      const { data: isAdminElevated } = await supabase.rpc("is_admin", {
        uid: user.id,
      } as never);
      if (isAdminElevated === true) {
        const redirect = reqUrl.clone();
        redirect.pathname = "/dashboard";
        redirect.search = "";
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
      const redirect = reqUrl.clone();
      redirect.pathname = "/dashboard/unauthorized";
      redirect.search = "";
      return NextResponse.redirect(redirect);
    }
  } catch (err) {
    console.error("[middleware] Supabase call failed:", err);
    if (isDashboard && !isLogin && !isUnauthorized) {
      const redirect = reqUrl.clone();
      redirect.pathname = "/dashboard/login";
      redirect.searchParams.set("error", "transient");
      return NextResponse.redirect(redirect);
    }
  }

  return response;
}
