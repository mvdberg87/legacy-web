import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { advertisementId } = await req.json();

    if (!advertisementId) {
      return NextResponse.json(
        { error: "advertisementId ontbreekt" },
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

    const { data: advertisement } = await supabaseAdmin
  .from("company_advertisements")
  .select("id, club_id, status")
  .eq("id", advertisementId)
  .maybeSingle();

if (!advertisement) {
  return NextResponse.json(
    { error: "Advertentie niet gevonden" },
    { status: 404 }
  );
}

if (advertisement.status === "active") {
  return NextResponse.json(
    { error: "Advertentie is al actief" },
    { status: 400 }
  );
}

    const { error } = await supabaseAdmin
      .from("company_advertisements")
      .update({
        status: "active",
        deleted_at: null,
      })
      .eq("id", advertisementId);


    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    await supabaseAdmin
  .from("subscription_events")
  .insert({
    club_id: advertisement.club_id,
    event_type: "advertisement_restored",
  });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}