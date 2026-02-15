// src/app/api/cron/renew-subscriptions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    /* ===============================
       🔐 Security check
       =============================== */
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const now = new Date();

    /* ===============================
       1. Actieve abonnementen verlopen
          → automatisch verlengen
       =============================== */
    const { data: clubs, error } = await supabaseAdmin
      .from("clubs")
      .select(`
        id,
        active_package,
        subscription_start,
        subscription_end,
        subscription_status
      `)
      .eq("subscription_status", "active")
      .lt("subscription_end", now.toISOString());

    if (error) {
      console.error("❌ Fetch subscriptions error:", error);
      return NextResponse.json(
        { error: "Fetch failed" },
        { status: 500 }
      );
    }

    let renewedCount = 0;

    for (const club of clubs ?? []) {
      if (!club.subscription_end) continue;

      const oldEnd = new Date(club.subscription_end);
      const newStart = new Date(oldEnd);
      const newEnd = new Date(oldEnd);
      newEnd.setFullYear(newEnd.getFullYear() + 1);

      /* ===============================
         2. Club updaten
         =============================== */
      await supabaseAdmin
        .from("clubs")
        .update({
          subscription_start: newStart.toISOString(),
          subscription_end: newEnd.toISOString(),
          subscription_status: "active",
        })
        .eq("id", club.id);

      /* ===============================
         3. Event loggen
         =============================== */
      await supabaseAdmin
        .from("subscription_events")
        .insert({
          club_id: club.id,
          event_type: "renewal",
          old_package: club.active_package,
          new_package: club.active_package,
          period_start: newStart.toISOString(),
          period_end: newEnd.toISOString(),
        });

      renewedCount++;
    }

    return NextResponse.json({
      success: true,
      renewed: renewedCount,
    });
  } catch (err) {
    console.error("❌ Renewal cron error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
