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

    // Club ophalen
    const { data: club, error: clubError } = await supabaseAdmin
      .from("clubs")
      .select("name, email")
      .eq("id", clubId)
      .single();

    // E-mails versturen (maar nooit de aanmelding blokkeren)
    if (!clubError && club) {
      try {
        await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "talentpool_new_profile",

              clubName: club.name,
              clubEmail: club.email,

              talentName: `${firstName} ${lastName}`,
              talentEmail: email,
              talentPhone: phone,

              preferences,
              education,
              study,
              field,

              city,
              distance,
              availableFrom,
              notes,
            }),
          }),

          fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "talentpool_confirmation",

              clubName: club.name,
              clubEmail: club.email,

              talentEmail: email,
            }),
          }),
        ]);
      } catch (mailError) {
        console.error("❌ Talentpool mail error:", mailError);
      }
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