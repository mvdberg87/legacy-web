import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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
       CLUB CHECK
    =============================== */

    const { data: club, error: clubError } =
      await supabaseAdmin
        .from("clubs")
        .select(`
          id,
          active_package,
          billing_override,
          billing_status,
          subscription_status
        `)
        .eq("id", clubId)
        .maybeSingle();

    if (clubError || !club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    if (!club.billing_override) {
      return NextResponse.json(
        { error: "Override is niet actief" },
        { status: 400 }
      );
    }

    /* ===============================
       OVERRIDE VERWIJDEREN
    =============================== */

    const { error: updateError } =
      await supabaseAdmin
        .from("clubs")
        .update({
          billing_override: false,
        })
        .eq("id", clubId);

    if (updateError) {
      throw updateError;
    }

    /* ===============================
       EVENT LOG
    =============================== */

    await supabaseAdmin
      .from("subscription_events")
      .insert({
        club_id: clubId,
        event_type: "admin_override_removed",
        old_package: "override",
        new_package: club.active_package,
      });

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    console.error(
      "Remove override error:",
      err
    );

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}