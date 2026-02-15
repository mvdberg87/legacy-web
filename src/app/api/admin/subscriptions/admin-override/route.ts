import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/* ===============================
   POST: Admin override → active
   =============================== */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clubId } = body;

    if (!clubId) {
      return NextResponse.json(
        { error: "clubId ontbreekt" },
        { status: 400 }
      );
    }

    /* ===============================
       1️⃣ Club ophalen
       =============================== */

    const { data: club, error: clubError } =
      await supabaseAdmin
        .from("clubs")
        .select(
          `
          id,
          active_package,
          subscription_start,
          subscription_end
        `
        )
        .eq("id", clubId)
        .maybeSingle();

    if (clubError || !club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    const now = new Date();
    const startDate = now.toISOString();

    // 1 jaar vanaf nu
    const endDate = new Date(
      now.setFullYear(now.getFullYear() + 1)
    ).toISOString();

    /* ===============================
       2️⃣ Club activeren (override)
       =============================== */

    const { error: updateError } =
      await supabaseAdmin
        .from("clubs")
        .update({
          has_paid_subscription: true,
          subscription_status: "active",
          subscription_start: startDate,
          subscription_end: endDate,
        })
        .eq("id", clubId);

    if (updateError) {
      console.error("Override update error:", updateError);
      return NextResponse.json(
        { error: "Kon abonnement niet activeren" },
        { status: 500 }
      );
    }

    /* ===============================
       3️⃣ Event loggen
       =============================== */

    await supabaseAdmin
      .from("subscription_events")
      .insert({
        club_id: clubId,
        event_type: "admin_override_activated",
        old_package: null,
        new_package: club.active_package,
        period_start: startDate,
        period_end: endDate,
      });

    /* ===============================
       4️⃣ Succes
       =============================== */

    return NextResponse.json({
      success: true,
      message:
        "Abonnement succesvol geactiveerd via admin override",
    });
  } catch (err) {
    console.error("Admin override error:", err);
    return NextResponse.json(
      { error: "Onverwachte fout" },
      { status: 500 }
    );
  }
}
