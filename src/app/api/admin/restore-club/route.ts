import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { clubId } = (await req.json()) as { clubId?: string };

    if (!clubId) {
      return NextResponse.json(
        { error: "clubId ontbreekt" },
        { status: 400 }
      );
    }

    /* ===============================
       1. Club ophalen (validatie)
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

    if (club.status !== "archived") {
      return NextResponse.json(
        { error: "Club is niet gearchiveerd" },
        { status: 400 }
      );
    }

    /* ===============================
       2. Club herstellen
       =============================== */
    await supabaseAdmin
      .from("clubs")
      .update({
        status: "approved",
        archived_at: null,
      })
      .eq("id", clubId);

    /* ===============================
       3. Jobs herstellen
       =============================== */
    await supabaseAdmin
      .from("jobs")
      .update({
        archived_at: null,
        is_active: true,
      })
      .eq("club_id", clubId);

    /* ===============================
       4. Sponsors herstellen
       =============================== */
    await supabaseAdmin
      .from("sponsors")
      .update({
        archived_at: null,
      })
      .eq("club_id", clubId);

    /* ===============================
       5. Signup request koppelen / afronden
       =============================== */
    await supabaseAdmin
      .from("club_signup_requests")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
      })
      .eq("club_id", clubId);

    /* ===============================
       6. Profielen opnieuw activeren
       =============================== */
    await supabaseAdmin
      .from("profiles")
      .update({
        is_active: true,
      })
      .eq("club_id", clubId);

    return NextResponse.json({
      success: true,
      message: `Club "${club.name}" is succesvol hersteld`,
    });
  } catch (err) {
    console.error("❌ restore-club error:", err);
    return NextResponse.json(
      { error: "Herstellen mislukt" },
      { status: 500 }
    );
  }
}
