"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerSupabase } from "@/lib/supabase/server";
import { getAdminSupabase } from "@/lib/supabase/admin";

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
    return { ok: false, error: "Invalid email or password." };
  }

  // Verify admin status BEFORE we let them into the dashboard.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Sign in failed. Please try again." };
  }

  const adminSupabase = getAdminSupabase();
  const { data: profileRaw } = await adminSupabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const profile = profileRaw as { role: string | null } | null;

  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    recordFailure(ip, email);
    return {
      ok: false,
      error:
        "This account doesn't have access to the admin dashboard.",
    };
  }

  clearFailures(ip, email);

  // Sanity-check the redirect target — only allow same-origin paths.
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  redirect(safeNext);
}
