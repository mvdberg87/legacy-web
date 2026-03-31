// src/app/api/jobs/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { SUBSCRIPTIONS } from "@/lib/subscriptions"; // bovenin file toevoegen!

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    /* ===============================
       1. Input ophalen
       =============================== */
    const body = await req.json();
console.log("JOB CREATE BODY:", body);

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
   3.5 🔒 Vacature limiet check
=============================== */

const { data: existingJobs } = await supabaseAdmin
  .from("jobs")
  .select("id")
  .eq("club_id", club.id)
  .is("archived_at", null);

const currentVacancies = existingJobs?.length ?? 0;
const maxVacancies =
  SUBSCRIPTIONS[club.active_package].vacancies;

if (currentVacancies >= maxVacancies) {
  return NextResponse.json(
    {
      error: "Maximaal aantal vacatures bereikt",
      reason: "limit_reached",
      current: currentVacancies,
      max: maxVacancies,
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
