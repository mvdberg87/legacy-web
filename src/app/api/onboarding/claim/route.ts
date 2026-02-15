// src/app/api/onboarding/claim/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { token?: string };
    const token = body.token;

    if (!token) {
      return NextResponse.json(
        { error: "Token ontbreekt" },
        { status: 400 }
      );
    }

    console.log("🔐 claim START, token:", token);

    /* ===============================
       1. Signup request ophalen
       =============================== */
    const signupRes = await supabaseAdmin
      .from("club_signup_requests")
      .select("id, club_id, status")
      .eq("token", token)
      .limit(1);

    if (signupRes.error) {
      console.error("❌ signup query error:", signupRes.error);
      return NextResponse.json(
        { error: "Database fout bij ophalen activatie" },
        { status: 500 }
      );
    }

    if (!signupRes.data || signupRes.data.length === 0) {
      return NextResponse.json(
        { error: "Activatielink ongeldig of al gebruikt" },
        { status: 400 }
      );
    }

    const signup = signupRes.data[0];
    console.log("✅ signup gevonden:", signup);

    if (signup.status !== "approved") {
      return NextResponse.json(
        { error: "Aanvraag is niet goedgekeurd" },
        { status: 400 }
      );
    }

    if (!signup.club_id) {
      return NextResponse.json(
        { error: "Geen club gekoppeld aan deze activatie" },
        { status: 400 }
      );
    }

    /* ===============================
       2. Club activeren
       =============================== */
    const clubUpdate = await supabaseAdmin
      .from("clubs")
      .update({
        subscription_status: "active",
        activated_at: new Date().toISOString(),
      })
      .eq("id", signup.club_id);

    if (clubUpdate.error) {
      console.error("❌ club update error:", clubUpdate.error);
      return NextResponse.json(
        { error: "Club activeren mislukt" },
        { status: 500 }
      );
    }

    /* ===============================
       3. Token ongeldig maken (EENMALIG)
       =============================== */
    const tokenClear = await supabaseAdmin
      .from("club_signup_requests")
      .update({ token: null })
      .eq("id", signup.id);

    if (tokenClear.error) {
      console.error("❌ token clear error:", tokenClear.error);
      // ⚠️ bewust géén hard fail
    }

    console.log("✅ claim DONE");

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("❌ onboarding/claim HARD FAIL:", err);
    return NextResponse.json(
      { error: "Activatie mislukt", message: err?.message },
      { status: 500 }
    );
  }
}
