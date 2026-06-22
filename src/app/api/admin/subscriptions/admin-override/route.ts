import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/* ===============================
   POST: Admin override → active
   =============================== */

export async function POST(req: NextRequest) {
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
   ADMIN AUTH CHECK
=============================== */

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
  data: { user: adminUser },
} = await supabase.auth.getUser();

if (!adminUser) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

const {
  data: profile,
  error: profileError,
} = await supabaseAdmin
  .from("profiles")
  .select("role")
  .eq("user_id", adminUser.id)
  .single();

if (
  profileError ||
  !profile ||
  profile.role !== "admin"
) {
  return NextResponse.json(
    { error: "Admin only" },
    { status: 403 }
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
          billing_override,
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

if (club.billing_override) {
  return NextResponse.json(
    { error: "Override is al actief" },
    { status: 400 }
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
      billing_override: true,
      subscription_status: "active",
      billing_status: "active",
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
        old_package: club.active_package,
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
