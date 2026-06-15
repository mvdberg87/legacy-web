import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { name, club, email, phone, pakket, message } =
      await req.json();

    if (!name || !club || !email) {
      return NextResponse.json(
        { error: "Verplichte velden ontbreken." },
        { status: 400 }
      );
    }

    const aanvraagType = pakket || "Demo aanvraag";

    // Mail naar Sponsorjobs
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      replyTo: email,
      to: ["info@sponsorjobs.nl"],
      subject: `Nieuwe aanvraag – ${aanvraagType}`,
      html: `
        <h2>Nieuwe aanvraag via Sponsorjobs</h2>

        <p><strong>Naam:</strong> ${name}</p>
        <p><strong>Club:</strong> ${club}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefoon:</strong> ${phone || "-"}</p>
        <p><strong>Type aanvraag:</strong> ${aanvraagType}</p>

        <hr />

        <p><strong>Toelichting:</strong></p>
        <p>${message || "-"}</p>
      `,
    });

    // Bevestiging naar vereniging
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: [email],
      subject: "Bedankt voor je aanvraag bij Sponsorjobs",
      html: `
        <h2>Bedankt voor jullie aanvraag!</h2>

        <p>Beste ${name},</p>

        <p>
          Bedankt voor jullie interesse in Sponsorjobs.
          Wij hebben jullie aanvraag goed ontvangen.
        </p>

        <p>
          Binnen <strong>3 werkdagen</strong> nemen wij contact met jullie op
          om de mogelijkheden voor jullie vereniging te bespreken.
        </p>

        <p>
          Hebben jullie in de tussentijd vragen?
          Neem gerust contact op via
          <a href="mailto:info@sponsorjobs.nl">
            info@sponsorjobs.nl
          </a>.
        </p>

        <br />

        <p>
          Met sportieve groet,<br />
          Team Sponsorjobs
        </p>

        <p>
          <a href="https://www.sponsorjobs.nl">
            www.sponsorjobs.nl
          </a>
        </p>
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