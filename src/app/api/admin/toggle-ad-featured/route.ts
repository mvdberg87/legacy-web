import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const {
      advertisementId,
      featured,
    } = await req.json();

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
  .select("id, club_id, is_featured")
  .eq("id", advertisementId)
  .maybeSingle();

if (!advertisement) {
  return NextResponse.json(
    { error: "Advertentie niet gevonden" },
    { status: 404 }
  );
}

    const { error } = await supabaseAdmin
      .from("company_advertisements")
      .update({
        is_featured: featured,
      })
      .eq("id", advertisementId);

      await supabaseAdmin
  .from("subscription_events")
  .insert({
    club_id: advertisement.club_id,
    event_type: featured
      ? "advertisement_featured"
      : "advertisement_unfeatured",
  });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}