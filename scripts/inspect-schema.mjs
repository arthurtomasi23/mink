// Probes the role check constraint by attempting writes.
// node --env-file=.env.local scripts/inspect-schema.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const candidates = [
  "user",
  "admin",
  "artist",
  "seeker",
  "pro",
  "tattoo_artist",
  "tattoo_seeker",
  "moderator",
  "owner",
  "superadmin",
];

const myId = "0724a1d9-902a-443b-bac7-103938006bc8";

console.log("\nProbing profiles.role values (only attempts an UPDATE, will revert on success):\n");
for (const role of candidates) {
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", myId)
    .select("id");
  const allowed = !error;
  console.log(`  ${allowed ? "✓ allowed" : "✗ REJECTED"}   role='${role}'${error ? ` — ${error.message.split("\n")[0]}` : ""}`);
}

// restore
await supabase.from("profiles").update({ role: "user" }).eq("id", myId);
console.log("\nrestored role to 'user'.\n");
