import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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