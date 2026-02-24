import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { name, club, email, phone, pakket, message } =
      await req.json();

    if (!name || !club || !email || !pakket) {
      return NextResponse.json(
        { error: "Verplichte velden ontbreken." },
        { status: 400 }
      );
    }

    // Mail naar SponsorJobs
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      replyTo: email,
      to: ["info@sponsorjobs.nl"],
      subject: `Nieuwe aanvraag – ${pakket.toUpperCase()}`,
      html: `
        <p><strong>Naam:</strong> ${name}</p>
        <p><strong>Club:</strong> ${club}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefoon:</strong> ${phone || "-"}</p>
        <p><strong>Pakket:</strong> ${pakket}</p>
        <hr/>
        <p>${message || "-"}</p>
      `,
    });

    // Bevestiging naar club
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: [email],
      subject: "We hebben jullie aanvraag ontvangen",
      html: `
        <p>Hallo ${name},</p>
        <p>
          Bedankt voor jullie interesse in het ${pakket.toUpperCase()} pakket.
          We nemen zo spoedig mogelijk contact met jullie op.
        </p>
        <p>SponsorJobs</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json(
      { error: "Interne serverfout" },
      { status: 500 }
    );
  }
}