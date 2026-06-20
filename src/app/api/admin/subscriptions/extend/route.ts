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

    const { data: club, error } = await supabaseAdmin
      .from("clubs")
      .select(`
  subscription_end,
  subscription_status
`)
      .eq("id", clubId)
      .maybeSingle();

    if (error || !club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    if (club.subscription_status === "blocked") {
  return NextResponse.json(
    { error: "Club is geblokkeerd" },
    { status: 400 }
  );
}

    const baseDate = club.subscription_end
      ? new Date(club.subscription_end)
      : new Date();

    const newEnd = new Date(baseDate);
    newEnd.setFullYear(newEnd.getFullYear() + 1);

    const { error: updateError } = await supabaseAdmin
  .from("clubs")
  .update({
    subscription_end: newEnd.toISOString(),
    subscription_status: "active",
    subscription_cancelled_at: null,
  })
  .eq("id", clubId);

if (updateError) {
  throw updateError;
}

      await supabaseAdmin
  .from("subscription_events")
  .insert({
    club_id: clubId,
    event_type: "subscription_extended",
    old_package: null,
    new_package: "active",
    period_end: newEnd.toISOString(),
  });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("extend subscription error", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
