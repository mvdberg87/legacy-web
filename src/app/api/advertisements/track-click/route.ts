import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const {
      advertisement_id,
      club_id,
      source,
    } = await req.json();

    if (!advertisement_id || !club_id) {
      return NextResponse.json(
        {
          error:
            "advertisement_id en club_id zijn verplicht",
        },
        { status: 400 }
      );
    }

    const { error } =
      await supabaseAdmin
        .from(
          "company_advertisement_clicks"
        )
        .insert({
          advertisement_id,
          club_id,
          source:
            source ?? "unknown",
        });

    if (error) {
      console.error(
        "❌ advertisement_click insert error:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    console.error(
      "❌ advertisement click crash:",
      err
    );

    return NextResponse.json(
      {
        error: "Unexpected error",
      },
      { status: 500 }
    );
  }
}