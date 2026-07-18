import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      clubId,
      firstName,
      lastName,
      email,
      phone,
      preferences,
      education,
      study,
      field,
      city,
      distance,
      availableFrom,
      notes,
    } = body;

    if (!clubId || !firstName || !lastName || !email) {
      return NextResponse.json(
        {
          error: "Ontbrekende verplichte velden",
        },
        {
          status: 400,
        }
      );
    }

    const { error: insertError } = await supabaseAdmin
      .from("talentpool_profiles")
      .insert({
        club_id: clubId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        preferences,
        education,
        study,
        field,
        city,
        distance,
        available_from: availableFrom || null,
        notes,
      });

    if (insertError) {
      console.error("❌ Talentpool insert error:", insertError);

      return NextResponse.json(
        {
          success: false,
          error: "Opslaan mislukt.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error("❌ Talentpool error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Er ging iets mis.",
      },
      {
        status: 500,
      }
    );
  }
}