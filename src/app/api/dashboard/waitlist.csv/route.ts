import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabase/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import type { WaitlistRole } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvEscape(v: unknown) {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: Request) {
  const me = await getAdminUser();
  if (!me) return new NextResponse("Forbidden", { status: 403 });

  const url = new URL(req.url);
  const role = url.searchParams.get("role") as WaitlistRole | null;

  const supabase = getAdminSupabase();
  let q = supabase
    .from("waitlist")
    .select("created_at, role, email, name, city, instagram, artist_spot, source")
    .order("created_at", { ascending: false })
    .limit(10000);
  if (role === "seeker" || role === "artist") q = q.eq("role", role);

  const { data, error } = await q;
  if (error) {
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }

  const header = [
    "created_at",
    "role",
    "email",
    "name",
    "city",
    "instagram",
    "artist_spot",
    "source",
  ];
  const lines = [header.join(",")];
  for (const r of data ?? []) {
    lines.push(header.map((k) => csvEscape((r as Record<string, unknown>)[k])).join(","));
  }
  const body = lines.join("\n");
  const filename = `mink-waitlist-${new Date().toISOString().slice(0, 10)}${role ? `-${role}` : ""}.csv`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}
