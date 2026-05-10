"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerSupabase } from "@/lib/supabase/server";

const FAILED_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const FAILED_ATTEMPT_LIMIT = 5;

type Attempt = { count: number; firstAt: number };
const attempts = new Map<string, Attempt>();

function bucketKey(ip: string, email: string) {
  return `${ip}:${email.toLowerCase()}`;
}

function isLockedOut(ip: string, email: string) {
  const key = bucketKey(ip, email);
  const a = attempts.get(key);
  if (!a) return false;
  if (Date.now() - a.firstAt > FAILED_ATTEMPT_WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return a.count >= FAILED_ATTEMPT_LIMIT;
}

function recordFailure(ip: string, email: string) {
  const key = bucketKey(ip, email);
  const a = attempts.get(key);
  if (!a || Date.now() - a.firstAt > FAILED_ATTEMPT_WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: Date.now() });
  } else {
    a.count += 1;
  }
}

function clearFailures(ip: string, email: string) {
  attempts.delete(bucketKey(ip, email));
}

export type LoginState =
  | { ok: false; error: string }
  | { ok: true };

export async function loginAction(
  _prev: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";

  if (isLockedOut(ip, email)) {
    return {
      ok: false,
      error:
        "Too many failed attempts. Please wait a few minutes before trying again.",
    };
  }

  const supabase = await getServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    recordFailure(ip, email);
    // Supabase merges several real problems into generic "invalid credentials".
    console.error("[dashboard/login]", error.code, error.message);

    const code = error.code ?? "";
    const msg = (error.message ?? "").toLowerCase();

    if (code === "email_not_confirmed" || msg.includes("email not confirmed")) {
      return {
        ok: false,
        error:
          "This email hasn’t been confirmed yet. In Supabase: Authentication → Users → open your user → confirm email, or disable “Confirm email” under Email provider for trusted testing.",
      };
    }

    if (
      code === "otp_disabled" ||
      msg.includes("signup is disabled") ||
      msg.includes("email signups")
    ) {
      return {
        ok: false,
        error:
          "Email sign-in looks disabled for this Supabase project. Authentication → Providers → Email: enable Email sign-in.",
      };
    }

    if (code === "user_banned") {
      return {
        ok: false,
        error: "This account has been banned. Contact support.",
      };
    }

    return {
      ok: false,
      error:
        "Wrong email or password for this Supabase project — or no password login exists yet.\n\n" +
        "Check: Supabase Dashboard → Authentication → Users (does this exact email appear?).\n\n" +
        "If you only used Apple/Google before, run the SQL from DASHBOARD_ADMIN_PROVISIONING.md to set `auth.users.email` + `encrypted_password`. Use the email you typed here and the password you set there.",
    };
  }

  // Verify admin status BEFORE we let them into the dashboard.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Sign in failed. Please try again." };
  }

  // Canonical gate: public.is_admin (admin_memberships + legacy profile flags).
  const { data: canAccess, error: rpcError } = await supabase.rpc(
    "is_admin",
    { uid: user.id } as never,
  );
  if (rpcError || canAccess !== true) {
    await supabase.auth.signOut();
    recordFailure(ip, email);
    return {
      ok: false,
      error:
        "No dashboard access for this account. Ask an owner to grant you access in Supabase (`admin_memberships` or legacy admin flags). You can use “Continue with Apple” if that account is authorized.",
    };
  }

  clearFailures(ip, email);

  // Sanity-check the redirect target — only allow same-origin paths.
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  redirect(safeNext);
}
