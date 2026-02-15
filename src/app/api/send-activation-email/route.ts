// src/app/api/send-activation-email/route.ts

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, clubName, token } = await req.json();

    if (!email || !clubName || !token) {
      return NextResponse.json(
        { error: "Ontbrekende velden" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      "http://localhost:3000";

    const claimUrl = `${baseUrl}/onboarding/claim?token=${token}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [email],
        subject: `Je clubaanvraag voor ${clubName} is goedgekeurd`,
        html: `
          <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#0d1b2a">
            <h2>Je club is goedgekeurd</h2>

            <p>
              Goed nieuws! De club <strong>${clubName}</strong> is goedgekeurd
              en kan nu worden geactiveerd.
            </p>

            <p style="margin:24px 0">
              <a href="${claimUrl}"
                 style="background:#0d1b2a;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">
                 Club activeren
              </a>
            </p>

            <p style="font-size:14px;color:#555">
              Werkt de knop niet? Kopieer deze link:<br/>
              <a href="${claimUrl}">${claimUrl}</a>
            </p>

            <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb" />

            <p style="font-size:12px;color:#6b7280">
              Deze e-mail is automatisch verzonden door Sponsorjobs.
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg);
    }

    console.log("📨 Activatiemail verstuurd naar", email);

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("❌ send-activation-email error:", err);
    return NextResponse.json(
      { error: "Mail versturen mislukt" },
      { status: 500 }
    );
  }
}
