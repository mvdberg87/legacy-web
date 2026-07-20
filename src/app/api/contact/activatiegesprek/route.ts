import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      companyName,
      contactName,
      email,
      phone,
      website,
      vacancies,
      currentSponsor,
      interest,
      notes,
    } = await req.json();

    if (
      !companyName ||
      !contactName ||
      !email ||
      !phone
    ) {
      return NextResponse.json(
        { error: "Verplichte velden ontbreken." },
        { status: 400 }
      );
    }

    // ==========================
    // Opslaan in Supabase
    // ==========================

    const { error } = await supabaseAdmin
      .from("activation_requests")
      .insert({
        company_name: companyName,
        contact_name: contactName,
        email,
        phone,
        website,
        vacancies,
        current_sponsor: currentSponsor,
        interest,
        notes,
        status: "new",
      });

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: "Database fout." },
        { status: 500 }
      );
    }

    // ==========================
    // Mail sturen
    // ==========================

    await resend.emails.send({
      from: "Sponsorjobs <noreply@sponsorjobs.nl>",
      to: ["info@sponsorjobs.nl"],
      replyTo: email,
      subject: `Nieuwe aanvraag activatiegesprek - ${companyName}`,

      html: `
        <h2>Nieuwe aanvraag activatiegesprek</h2>

        <table cellpadding="8">

          <tr>
            <td><strong>Bedrijf</strong></td>
            <td>${companyName}</td>
          </tr>

          <tr>
            <td><strong>Contactpersoon</strong></td>
            <td>${contactName}</td>
          </tr>

          <tr>
            <td><strong>E-mail</strong></td>
            <td>${email}</td>
          </tr>

          <tr>
            <td><strong>Telefoon</strong></td>
            <td>${phone}</td>
          </tr>

          <tr>
            <td><strong>Website</strong></td>
            <td>${website || "-"}</td>
          </tr>

          <tr>
            <td><strong>Vacatures</strong></td>
            <td>${vacancies || "-"}</td>
          </tr>

          <tr>
            <td><strong>Sponsor van</strong></td>
            <td>${currentSponsor || "-"}</td>
          </tr>

          <tr>
            <td><strong>Interesse</strong></td>
            <td>${interest || "-"}</td>
          </tr>

        </table>

        <h3>Toelichting</h3>

        <p>${notes || "-"}</p>
      `,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      {
        error: "Er ging iets mis.",
      },
      {
        status: 500,
      }
    );
  }
}