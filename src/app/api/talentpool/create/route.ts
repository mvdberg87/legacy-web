import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

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
  .select("id, name, email")
  .eq("id", clubId)
  .single();

      // E-mailadres bepalen (club → profiel)
let clubEmail = club?.email;

if (!clubEmail && club) {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email")
    .eq("club_id", club.id)
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  clubEmail = profile?.email;
}

    // E-mails versturen (maar nooit de aanmelding blokkeren)
    if (!clubError && club && clubEmail) {
      try {
        await Promise.all([
  resend.emails.send({
    from: "Sponsorjobs <no-reply@sponsorjobs.nl>",
    to: clubEmail,
    subject: `Nieuwe Talentpool-aanmelding bij ${club.name}`,
    html: `
      <h2>Nieuwe Talentpool-aanmelding</h2>

      <p><strong>Naam:</strong> ${firstName} ${lastName}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Telefoon:</strong> ${phone || "-"}</p>

      <hr />

      <p><strong>Voorkeuren:</strong> ${preferences?.join(", ") || "-"}</p>

      <p>
        <strong>Opleiding:</strong><br />
        Niveau: ${education || "-"}<br />
        Studie: ${study || "-"}<br />
        Vakgebied: ${field || "-"}
      </p>

      <p>
        <strong>Woonplaats:</strong> ${city || "-"}<br />
        <strong>Reisafstand:</strong> ${distance ?? "-"} km<br />
        <strong>Beschikbaar vanaf:</strong> ${
          availableFrom
            ? new Date(availableFrom).toLocaleDateString("nl-NL")
            : "-"
        }
      </p>

      ${
        notes
          ? `<p><strong>Toelichting:</strong><br/>${notes}</p>`
          : ""
      }
    `,
  }),

  resend.emails.send({
    from: "Sponsorjobs <no-reply@sponsorjobs.nl>",
    to: email,
    replyTo: clubEmail,
    subject: `Bedankt voor je aanmelding bij de Talentpool van ${club.name}`,
    html: `
      <h2>Bedankt voor je aanmelding!</h2>

      <p>
        Je profiel is succesvol toegevoegd aan de Talentpool van
        <strong>${club.name}</strong>.
      </p>

      <p>
        Wanneer één van de aangesloten sponsoren een passende vacature heeft,
        kan er contact met je worden opgenomen.
      </p>

      <p>Veel succes!</p>

      <p>Team Sponsorjobs</p>
    `,
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