import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const {
      clubId,
      contactPerson,
    } = await req.json();

    if (!clubId || !contactPerson) {
      return NextResponse.json(
        {
          error:
            "clubId en contactPerson zijn verplicht",
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

    const { data: request } =
      await supabaseAdmin
        .from("club_signup_requests")
        .select("id")
        .eq("club_id", clubId)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .single();

    if (!request) {
      return NextResponse.json(
        {
          error:
            "Geen signup request gevonden",
        },
        { status: 404 }
      );
    }

    const { error } =
      await supabaseAdmin
        .from("club_signup_requests")
        .update({
          message: contactPerson,
        })
        .eq("id", request.id);

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
    event_type: "contact_person_updated",
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