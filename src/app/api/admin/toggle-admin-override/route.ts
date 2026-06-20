import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
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
    .select("admin_override")
    .eq("id", clubId)
    .single();

  if (error || !club) {
    return NextResponse.json(
      { error: "Club niet gevonden" },
      { status: 404 }
    );
  }

  const newValue = !club.admin_override;

  const { error: updateError } = await supabaseAdmin
  .from("clubs")
  .update({
    admin_override: newValue,
  })
  .eq("id", clubId);

if (updateError) {
  throw updateError;
}

await supabaseAdmin
  .from("subscription_events")
  .insert({
    club_id: clubId,
    event_type: newValue
      ? "admin_override_enabled"
      : "admin_override_disabled",
  });

  return NextResponse.json({
  success: true,
  admin_override: newValue,
});
}
