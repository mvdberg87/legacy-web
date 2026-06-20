import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
  const { clubId } = await req.json();

  if (!clubId) {
    return NextResponse.json(
      { error: "clubId ontbreekt" },
      { status: 400 }
    );
  }

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

const { data: club } = await supabaseAdmin
  .from("clubs")
  .select("subscription_status")
  .eq("id", clubId)
  .maybeSingle();

if (!club) {
  return NextResponse.json(
    { error: "Club niet gevonden" },
    { status: 404 }
  );
}

if (club.subscription_status !== "blocked") {
  return NextResponse.json(
    { error: "Club is niet geblokkeerd" },
    { status: 400 }
  );
}

  const { error } = await supabaseAdmin
  .from("clubs")
  .update({
    subscription_status: null,
  })
  .eq("id", clubId);

if (error) throw error;

    await supabaseAdmin
  .from("subscription_events")
  .insert({
    club_id: clubId,
    event_type: "unblocked",
    old_package: "blocked",
    new_package: null,
  });

  return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Deblokkeren mislukt" },
      { status: 500 }
    );
  }
}