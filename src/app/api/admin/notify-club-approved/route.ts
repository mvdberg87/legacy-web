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

    const { data: club, error } = await supabaseAdmin
      .from("clubs")
      .select("name, email")
      .eq("id", clubId)
      .single();

    if (error || !club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/login`;

    await resend.emails.send({
      from: "Sponsorjobs <no-reply@sponsorjobs.nl>",
      to: [club.email],
      subject: "🎉 Je club is goedgekeurd – je kunt nu starten",
      html: `
        <h2>Welkom bij Sponsorjobs 🎉</h2>

        <p>Goed nieuws <strong>${club.name}</strong>!</p>

        <p>Je clubaccount is zojuist goedgekeurd.</p>

        <p>
          👉 <a href="${loginUrl}">
            Klik hier om in te loggen
          </a>
        </p>

        <p>
          Gebruik het e-mailadres waarmee je je hebt aangemeld.
          Je ontvangt daarna automatisch een magic link.
        </p>

        <p>Veel succes!</p>
        <p>— Team Sponsorjobs</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Notify club approved error:", err);
    return NextResponse.json(
      { error: "Mail versturen mislukt" },
      { status: 500 }
    );
  }
}
