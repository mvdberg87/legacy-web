// src/app/api/admin/subscriptions/events/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    /* ===============================
       1. Auth / security
       =============================== */
    const { searchParams } = new URL(req.url);
    const clubId = searchParams.get("clubId");

    if (!clubId) {
      return NextResponse.json(
        { error: "clubId ontbreekt" },
        { status: 400 }
      );
    }

    /* ===============================
       2. Events ophalen
       =============================== */
    const { data: events, error } = await supabaseAdmin
      .from("subscription_events")
      .select(
        `
        id,
        event_type,
        old_package,
        new_package,
        period_start,
        period_end,
        created_at
      `
      )
      .eq("club_id", clubId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Fetch subscription events error:", error);
      return NextResponse.json(
        { error: "Kon abonnementsgeschiedenis niet ophalen" },
        { status: 500 }
      );
    }

    /* ===============================
       3. Response
       =============================== */
    return NextResponse.json({
      events: events ?? [],
    });
  } catch (err) {
    console.error("❌ subscriptions/events fatal error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
