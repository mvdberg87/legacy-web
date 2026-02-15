// src/app/api/jobs/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    /* ===============================
       1. Input ophalen
       =============================== */
    const body = await req.json();

    const {
      clubId,
      title,
      company_name,
      apply_url,
    }: {
      clubId?: string;
      title?: string;
      company_name?: string;
      apply_url?: string;
    } = body;

    if (!clubId || !title || !company_name || !apply_url) {
      return NextResponse.json(
        { error: "Ontbrekende velden" },
        { status: 400 }
      );
    }

    /* ===============================
       2. Club ophalen
       =============================== */
    const { data: club, error: clubError } = await supabaseAdmin
      .from("clubs")
      .select(
        "id, active_package, subscription_status"
      )
      .eq("id", clubId)
      .maybeSingle();

    if (clubError || !club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    /* ===============================
       3. 🔒 Subscription check
       =============================== */
    if (club.subscription_status === "blocked") {
      return NextResponse.json(
        {
          error:
            "Account is geblokkeerd. Vacatures aanmaken is niet mogelijk.",
        },
        { status: 403 }
      );
    }

    /* ===============================
       4. Vacature aanmaken
       =============================== */
    const { error: insertError } = await supabaseAdmin
      .from("jobs")
      .insert({
        club_id: club.id,
        title: title.trim(),
        company_name: company_name.trim(),
        apply_url: apply_url.trim(),
        featured: false,
        archived_at: null,
      });

    if (insertError) {
      console.error("❌ Job insert error:", insertError);
      return NextResponse.json(
        { error: "Vacature aanmaken mislukt" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ jobs/create error:", err);
    return NextResponse.json(
      { error: "Interne serverfout" },
      { status: 500 }
    );
  }
}
