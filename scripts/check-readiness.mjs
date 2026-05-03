// Verifies the Supabase project has everything the dashboard needs.
// node --env-file=.env.local scripts/check-readiness.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const checks = [];
function ok(name, detail = "") {
  checks.push({ name, status: "OK", detail });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}
function fail(name, detail) {
  checks.push({ name, status: "FAIL", detail });
  console.log(`✗ ${name} — ${detail}`);
}

console.log("\n— Mink readiness check —\n");

async function tableExists(table) {
  // Real read (not HEAD) — PostgREST surfaces table-missing errors
  // reliably this way.
  const { error } = await supabase.from(table).select("*").limit(1);
  return error ? { ok: false, message: error.message } : { ok: true };
}

// 1. profiles
{
  const r = await tableExists("profiles");
  if (!r.ok) fail("profiles table reachable", r.message);
  else ok("profiles table");
}

// 2. profiles.role distinct
{
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .not("role", "is", null);
  if (error) fail("profiles.role readable", error.message);
  else {
    const roles = [...new Set(data.map((r) => r.role))];
    const admins = data.filter((r) => r.role === "admin").length;
    if (admins > 0) ok("admin user exists", `${admins} admin(s)`);
    else
      fail(
        "admin user exists",
        `no rows with role='admin'. distinct roles: [${roles.join(", ") || "none"}]`,
      );
  }
}

// 3. waitlist table
{
  const r = await tableExists("waitlist");
  if (!r.ok) fail("waitlist table", r.message);
  else ok("waitlist table");
}

// 4. admin_audit_log
{
  const r = await tableExists("admin_audit_log");
  if (!r.ok) fail("admin_audit_log table", r.message);
  else ok("admin_audit_log table");
}

// 5. is_admin() function
{
  const { error } = await supabase.rpc("is_admin", {
    uid: "00000000-0000-0000-0000-000000000000",
  });
  if (error) fail("is_admin() function", error.message);
  else ok("is_admin() function");
}

const failures = checks.filter((c) => c.status === "FAIL");
console.log(
  `\n${failures.length === 0 ? "All good ✨" : `${failures.length} item(s) need attention`}\n`,
);

if (failures.length > 0) {
  const projectRef = (url ?? "").match(/https?:\/\/([^.]+)\./)?.[1];
  const sqlEditorUrl = projectRef
    ? `https://supabase.com/dashboard/project/${projectRef}/sql/new`
    : "https://supabase.com/dashboard → your project → SQL editor";
  console.log(`Next step: apply the migration.`);
  console.log(`  1. Open ${sqlEditorUrl}`);
  console.log(`  2. Paste the contents of:`);
  console.log(`       supabase/migrations/20260503140000_admin_and_waitlist.sql`);
  console.log(`  3. Click "Run" — it's idempotent and safe to re-run.\n`);
}

process.exit(failures.length === 0 ? 0 : 1);
