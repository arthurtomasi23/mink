"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getServerSupabase, getAdminUser } from "@/lib/supabase/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { DASHBOARD_ADMIN_OR } from "@/lib/supabase/dashboard-access";
import type { AuditLogInsert, ProfileUpdate } from "@/lib/supabase/types";
import { generateSecurePassword } from "@/lib/password";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function audit(
  action: string,
  details: {
    targetId?: string | null;
    targetEmail?: string | null;
    metadata?: Record<string, unknown>;
  } = {},
) {
  const me = await getAdminUser();
  if (!me) return;
  const supabase = getAdminSupabase();
  const h = await headers();
  const row: AuditLogInsert = {
    actor_id: me.id,
    actor_email: me.email ?? null,
    action,
    target_id: details.targetId ?? null,
    target_email: details.targetEmail ?? null,
    metadata: {
      ...(details.metadata ?? {}),
      ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      user_agent: h.get("user-agent") ?? null,
    },
  };
  await supabase.from("admin_audit_log").insert(row as never);
}

// ---------------------------------------------------------------------
// Sign out
// ---------------------------------------------------------------------
export async function logoutAction() {
  const supabase = await getServerSupabase();
  await supabase.auth.signOut();
  redirect("/dashboard/login");
}

// ---------------------------------------------------------------------
// Invite a new admin (creates the auth user if needed, sets is_admin)
// ---------------------------------------------------------------------
export type AdminMutationState =
  | {
      ok: true;
      message: string;
      /** One-time password to share with the new admin via a secure channel. */
      password?: string;
      email?: string;
      createdNew?: boolean;
    }
  | { ok: false; error: string }
  | undefined;

export async function inviteAdminAction(
  _prev: AdminMutationState,
  formData: FormData,
): Promise<AdminMutationState> {
  const me = await getAdminUser();
  if (!me) return { ok: false, error: "Not authorized." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const displayName =
    String(formData.get("displayName") ?? "").trim() || null;

  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const supabase = getAdminSupabase();

  // Look up an existing auth user with this email — paginate up to 1k.
  let userId: string | null = null;
  let page = 1;
  while (page <= 5) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) return { ok: false, error: error.message };
    const found = data.users.find(
      (u) => (u.email ?? "").toLowerCase() === email,
    );
    if (found) {
      userId = found.id;
      break;
    }
    if (data.users.length < 200) break;
    page += 1;
  }

  // Generate a one-time password we can hand to the new admin. We
  // surface it back to the inviting admin exactly once and never store it.
  const tempPassword = generateSecurePassword(18);

  let createdNew = false;
  if (!userId) {
    // Brand new user: create them directly with the password so they can
    // sign in to the dashboard immediately. We mark email as confirmed so
    // they don't need to click a confirmation link first.
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { name: displayName, invited_as: "admin" },
    });
    if (error || !data.user) {
      return {
        ok: false,
        error: error?.message ?? "Could not create this user.",
      };
    }
    userId = data.user.id;
    createdNew = true;
  } else {
    // Existing user (e.g. signed up in the iOS app via Apple): set a
    // password so they can sign into the dashboard. Other sign-in
    // methods (Apple, Google, magic link) keep working.
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: tempPassword,
    });
    if (error) {
      return {
        ok: false,
        error: `Couldn't set a dashboard password: ${error.message}`,
      };
    }
  }

  // Grant dashboard access via is_admin-compatible flags. Mobile may use
  // `admin_memberships` as source of truth — if so, add an insert here when ready.
  const update: ProfileUpdate = { is_admin: true };
  if (displayName) update.name = displayName;

  const { error: upErr, data: updated } = await supabase
    .from("profiles")
    .update(update as never)
    .eq("id", userId)
    .select("id");

  if (upErr) {
    return { ok: false, error: upErr.message };
  }
  if (!updated || updated.length === 0) {
    const { error: insertErr } = await supabase.from("profiles").insert({
      id: userId,
      name: displayName,
      role: "user",
      is_admin: true,
    } as never);
    if (insertErr) {
      return {
        ok: false,
        error: `Promoted in auth, but couldn't create profile row: ${insertErr.message}`,
      };
    }
  }

  await audit("admin.invited", {
    targetId: userId,
    targetEmail: email,
    // NEVER log the password itself.
    metadata: { createdNew, displayName, password_set: true },
  });

  revalidatePath("/dashboard/admins");
  return {
    ok: true,
    email,
    password: tempPassword,
    createdNew,
    message: createdNew
      ? `${email} is now an admin. Share the password below securely.`
      : `${email} has been promoted to admin and a new dashboard password was set.`,
  };
}

// ---------------------------------------------------------------------
// Demote an admin (cannot demote yourself, cannot demote the last one)
// ---------------------------------------------------------------------
export async function demoteAdminAction(formData: FormData) {
  const me = await getAdminUser();
  if (!me) {
    redirect("/dashboard/login");
  }

  const targetId = String(formData.get("targetId") ?? "");
  if (!targetId) return;

  if (targetId === me.id) {
    return; // self-demotion silently rejected
  }

  const supabase = getAdminSupabase();

  // Count everyone with dashboard access (is_admin or legacy role).
  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .or(DASHBOARD_ADMIN_OR);
  if ((count ?? 0) <= 1) return;

  // Look up target so we can revoke is_admin and migrate legacy role='admin'.
  const { data: profRaw } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", targetId)
    .maybeSingle();
  const prof = profRaw as { role: string | null } | null;

  let targetEmail: string | null = null;
  try {
    const { data } = await supabase.auth.admin.getUserById(targetId);
    targetEmail = data?.user?.email ?? null;
  } catch {
    // ignore
  }

  const patch: ProfileUpdate = { is_admin: false };
  if (prof?.role === "admin") {
    patch.role = "user";
  }

  await supabase.from("profiles").update(patch as never).eq("id", targetId);

  await audit("admin.demoted", {
    targetId,
    targetEmail,
  });

  revalidatePath("/dashboard/admins");
}

// ---------------------------------------------------------------------
// Delete a waitlist entry (e.g. spam)
// ---------------------------------------------------------------------
export async function deleteWaitlistEntryAction(formData: FormData) {
  const me = await getAdminUser();
  if (!me) redirect("/dashboard/login");

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = getAdminSupabase();
  const { data: rowRaw } = await supabase
    .from("waitlist")
    .select("email, role")
    .eq("id", id)
    .maybeSingle();
  const row = rowRaw as { email: string | null; role: string | null } | null;

  await supabase.from("waitlist").delete().eq("id", id);

  await audit("waitlist.deleted", {
    targetEmail: row?.email ?? null,
    metadata: { role: row?.role ?? null },
  });

  revalidatePath("/dashboard/waitlist");
  revalidatePath("/dashboard");
}
