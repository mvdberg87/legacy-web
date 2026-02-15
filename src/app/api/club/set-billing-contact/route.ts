// src/app/api/club/subscription/set-billing-contact/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const {
      clubId,
      billingName,
      billingEmail,
    } = (await req.json()) as {
      clubId?: string;
      billingName?: string;
      billingEmail?: string;
    };

    if (!clubId || !billingName || !billingEmail) {
      return NextResponse.json(
        {
          error:
            "clubId, billingName en billingEmail zijn verplicht",
        },
        { status: 400 }
      );
    }

    /* ===============================
       1. Club ophalen
       =============================== */
    const { data: club, error: fetchError } =
      await supabaseAdmin
        .from("clubs")
        .select(
          `
          id,
          name,
          subscription_status
        `
        )
        .eq("id", clubId)
        .single();

    if (fetchError || !club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    /* ===============================
       2. Status check
       =============================== */
    if (club.subscription_status !== "awaiting_payment") {
      return NextResponse.json(
        {
          error:
            "Betaling kan alleen worden ingesteld bij status awaiting_payment",
        },
        { status: 409 }
      );
    }

    /* ===============================
       3. Billing contact opslaan
       =============================== */
    await supabaseAdmin
      .from("clubs")
      .update({
        billing_contact_name: billingName,
        billing_contact_email: billingEmail,
      })
      .eq("id", clubId);

    /* ===============================
       4. Event loggen
       =============================== */
    await supabaseAdmin
      .from("subscription_events")
      .insert({
        club_id: clubId,
        event_type: "billing_contact_set",
      });

    /* ===============================
       5. MAIL 3 – Betaalverzoek
       =============================== */
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      replyTo: process.env.EMAIL_REPLY_TO!,
      to: [billingEmail],
      subject: `Actie vereist: betaling regelen voor ${club.name}`,
      html: `
        <p>Hallo <strong>${billingName}</strong>,</p>

        <p>
          Voor <strong>${club.name}</strong> is een upgrade
          goedgekeurd.
        </p>

        <p>
          Om het abonnement te activeren, vragen we je
          om de betaling te regelen via automatische incasso.
        </p>

        <p>
          👉 <a href="${process.env.NEXT_PUBLIC_SITE_URL}/billing/start?club=${club.id}">
            <strong>Geef incassomachtiging</strong>
          </a>
        </p>

        <p>
          Na bevestiging wordt het abonnement automatisch
          geactiveerd.
        </p>

        <p>
          Met sportieve groet,<br/>
          <strong>Michiel van den Berg</strong><br/>
          Sponsorjobs
        </p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ set-billing-contact error:", err);
    return NextResponse.json(
      { error: "Interne serverfout" },
      { status: 500 }
    );
  }
}
