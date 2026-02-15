// src/app/api/admin/fix-profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import getSupabaseServer from "../../../../lib/supabase.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST body: { user_id: string, club_id: string, email?: string, role?: "admin" | "manager" }
 * Vereist header: x-admin-secret: <ADMIN_APPROVAL_SECRET>
 * Upsert public.profiles met service role (bypassed RLS).
 */
export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-admin-secret");
    if (!secret || secret !== process.env.ADMIN_APPROVAL_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const user_id = (body?.user_id ?? "").trim();
    const club_id = (body?.club_id ?? "").trim();
    const email = (body?.email ?? "").trim() || null;
    const role = (body?.role ?? "admin").trim();

    if (!user_id || !club_id) {
      return NextResponse.json({ error: "Missing user_id or club_id" }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    // check club bestaat
    const { data: club, error: cErr } = await supabase
      .from("clubs")
      .select("id")
      .eq("id", club_id)
      .maybeSingle();
    if (cErr) throw cErr;
    if (!club) return NextResponse.json({ error: "Club niet gevonden" }, { status: 404 });

    // upsert profiel
    const { error: upErr } = await supabase
      .from("profiles")
      .upsert(
        { user_id, club_id, role, email } as any,
        { onConflict: "user_id" }
      );
    if (upErr) throw upErr;

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Onbekende fout" }, { status: 500 });
  }
}
