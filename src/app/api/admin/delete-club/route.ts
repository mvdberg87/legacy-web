// src/app/api/admin/delete-club/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { clubId } = await req.json();

    if (!clubId) {
      return NextResponse.json(
        { error: "clubId ontbreekt" },
        { status: 400 }
      );
    }

    const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name) {
        return req.cookies.get(name)?.value;
      },
    },
  }
);

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

const { data: profile, error: profileError } = await supabaseAdmin
  .from("profiles")
  .select("role")
  .eq("user_id", user.id)
  .single();

if (profileError || !profile || profile.role !== "admin") {
  return NextResponse.json(
    { error: "Admin only" },
    { status: 403 }
  );
}

    /* ===============================
       1. Club ophalen
       =============================== */
    const { data: club, error: clubError } = await supabaseAdmin
      .from("clubs")
      .select("id, name, status")
      .eq("id", clubId)
      .single();

    if (clubError || !club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    if (club.status === "archived") {
  return NextResponse.json(
    { error: "Club is al gearchiveerd" },
    { status: 400 }
  );
}

    const now = new Date().toISOString();

    /* ===============================
       2. Club archiveren
       =============================== */
    const { error: archiveError } =
  await supabaseAdmin
    .from("clubs")
    .update({
      status: "archived",
      archived_at: now,
    })
    .eq("id", clubId);

if (archiveError) {
  throw archiveError;
}

    /* ===============================
       3. Gerelateerde data archiveren
       =============================== */
    await supabaseAdmin
      .from("jobs")
      .update({ archived_at: now, is_active: false })
      .eq("club_id", clubId);

    await supabaseAdmin
      .from("sponsors")
      .update({ archived_at: now })
      .eq("club_id", clubId);

    /* ===============================
       4. Signup request bijwerken
       =============================== */
    await supabaseAdmin
      .from("club_signup_requests")
      .update({
        status: "archived",
        reviewed_at: now,
      })
      .eq("club_id", clubId);

      await supabaseAdmin
  .from("subscription_events")
  .insert({
    club_id: clubId,
    event_type: "club_archived",
  });

    return NextResponse.json({
      success: true,
      message: `Club "${club.name}" is gearchiveerd`,
    });
  } catch (err) {
    console.error("❌ archive-club error:", err);
    return NextResponse.json(
      { error: "Archiveren mislukt" },
      { status: 500 }
    );
  }
}
