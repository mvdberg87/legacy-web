import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const {
  clubId,
  contactName,
  contactEmail,
  contactPhone,
} = await req.json();

    if (!clubId || !contactName) {
  return NextResponse.json(
    {
      error: "clubId en contactName zijn verplicht",
    },
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

    const { error } = await supabaseAdmin
  .from("clubs")
  .update({
    contact_name: contactName,
    contact_email: contactEmail,
    contact_phone: contactPhone,
  })
  .eq("id", clubId);

if (error) {
  return NextResponse.json(
    { error: error.message },
    { status: 500 }
  );
}

    await supabaseAdmin
  .from("subscription_events")
  .insert({
    club_id: clubId,
    event_type: "club_contact_updated",
  });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          "Opslaan mislukt",
      },
      { status: 500 }
    );
  }
}