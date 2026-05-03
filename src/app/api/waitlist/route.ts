import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { captureServer } from "@/lib/posthog/server";
import type { WaitlistInsert } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Role = "seeker" | "artist";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STORE_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(STORE_DIR, "waitlist.json");

type FallbackEntry = {
  id: string;
  role: Role;
  email: string;
  name?: string;
  city?: string;
  instagram?: string;
  ip?: string;
  user_agent?: string;
  artist_spot?: number;
  created_at: string;
};

async function fallbackInsert(entry: FallbackEntry) {
  await fs.mkdir(STORE_DIR, { recursive: true });
  let entries: FallbackEntry[] = [];
  try {
    entries = JSON.parse(await fs.readFile(STORE_PATH, "utf8"));
  } catch {
    entries = [];
  }
  if (
    entries.some((e) => e.email === entry.email && e.role === entry.role)
  ) {
    const existing = entries.find(
      (e) => e.email === entry.email && e.role === entry.role,
    )!;
    return { duplicate: true, spot: existing.artist_spot ?? null };
  }
  if (entry.role === "artist") {
    entry.artist_spot =
      entries.filter((e) => e.role === "artist").length + 1;
  }
  entries.push(entry);
  await fs.writeFile(STORE_PATH, JSON.stringify(entries, null, 2), "utf8");
  return { duplicate: false, spot: entry.artist_spot ?? null };
}

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const role: Role = body.role === "artist" ? "artist" : "seeker";
  const email = String(body.email ?? "").trim().toLowerCase();
  const name =
    typeof body.name === "string" && body.name.trim().length > 0
      ? body.name.trim().slice(0, 120)
      : null;
  const city =
    typeof body.city === "string" && body.city.trim().length > 0
      ? body.city.trim().slice(0, 80)
      : null;
  const instagram =
    typeof body.instagram === "string" && body.instagram.trim().length > 0
      ? body.instagram.trim().replace(/^@/, "").slice(0, 60)
      : null;

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;
  const userAgent = req.headers.get("user-agent") ?? null;

  // ---------------------------------------------------------------
  // Path A: Supabase is configured (production / preview).
  // ---------------------------------------------------------------
  if (isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = getAdminSupabase();

      // Duplicate check (case-insensitive on email)
      const { data: existingRaw, error: findErr } = await supabase
        .from("waitlist")
        .select("id, artist_spot")
        .eq("role", role)
        .eq("email", email)
        .maybeSingle();
      if (findErr) throw findErr;
      const existing = existingRaw as
        | { id: string; artist_spot: number | null }
        | null;
      if (existing) {
        return NextResponse.json({
          ok: true,
          spot: existing.artist_spot ?? null,
          duplicate: true,
        });
      }

      // Assign founding-artist spot
      let artistSpot: number | null = null;
      if (role === "artist") {
        const { count, error: countErr } = await supabase
          .from("waitlist")
          .select("id", { count: "exact", head: true })
          .eq("role", "artist");
        if (countErr) throw countErr;
        artistSpot = (count ?? 0) + 1;
      }

      const insertRow: WaitlistInsert = {
        role,
        email,
        name,
        city,
        instagram,
        artist_spot: artistSpot,
        ip,
        user_agent: userAgent,
        source: "landing",
      };
      const { data: insertedRaw, error: insertErr } = await supabase
        .from("waitlist")
        .insert(insertRow as never)
        .select("id, artist_spot")
        .single();
      if (insertErr) throw insertErr;
      const inserted = insertedRaw as {
        id: string;
        artist_spot: number | null;
      };

      // Fire and (mostly) forget
      captureServer("waitlist_joined", inserted.id, {
        role,
        founding: role === "artist" && (artistSpot ?? 9999) <= 100,
        artist_spot: artistSpot,
      }).catch(() => {});

      return NextResponse.json({
        ok: true,
        spot: inserted.artist_spot ?? null,
      });
    } catch (err) {
      console.error("[waitlist] supabase insert failed", err);
      return NextResponse.json(
        {
          ok: false,
          error:
            "Could not save your entry right now. Please try again shortly.",
        },
        { status: 500 },
      );
    }
  }

  // ---------------------------------------------------------------
  // Path B: dev fallback to local JSON so the form still works
  // before Supabase is wired up.
  // ---------------------------------------------------------------
  try {
    const result = await fallbackInsert({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 10),
      role,
      email,
      name: name ?? undefined,
      city: city ?? undefined,
      instagram: instagram ?? undefined,
      ip: ip ?? undefined,
      user_agent: userAgent ?? undefined,
      created_at: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, spot: result.spot });
  } catch (err) {
    console.error("[waitlist] local fallback failed", err);
    return NextResponse.json(
      { ok: false, error: "Storage unavailable." },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed" },
    { status: 405 },
  );
}
