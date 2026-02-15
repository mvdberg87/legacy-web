import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { clubId } = await req.json();

    if (!clubId) {
      return NextResponse.json(
        { error: "Missing clubId" },
        { status: 400 }
      );
    }

    /* ===============================
       1. Club ophalen
       =============================== */
    const { data: club, error: clubError } = await supabaseAdmin
      .from("clubs")
      .select("name, email, slug")
      .eq("id", clubId)
      .single();

    if (clubError || !club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    /* ===============================
       2. Login link
       =============================== */
    const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/login`;

    /* ===============================
       3. Mail naar club
       =============================== */
    await resend.emails.send({
      from: "Sponsorjobs <no-reply@sponsorjobs.nl>",
      to: [club.email],
      subject: "🎉 Je club is goedgekeurd – je kunt nu starten",
      html: `
        <h2>Welkom bij Sponsorjobs 🎉</h2>
        <p>Goed nieuws <strong>${club.name}</strong>!</p>
        <p>Je clubaccount is goedgekeurd door onze administratie.</p>

        <p>
          👉 <a href="${loginUrl}">
            Klik hier om in te loggen
          </a>
        </p>

        <p>
          Na het inloggen kom je direct in je clubdashboard
          waar je aan de slag kunt met Sponsorjobs.
        </p>

        <p>Veel succes en plezier!</p>
        <p>— Team Sponsorjobs</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Notify club approved error:", err);
    return NextResponse.json(
      { error: "Failed to send approval mail" },
      { status: 500 }
    );
  }
}
