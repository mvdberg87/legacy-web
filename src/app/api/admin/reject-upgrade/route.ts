// src/app/api/admin/reject-upgrade/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { requestId, reason } = (await req.json()) as {
      requestId?: string;
      reason?: string;
    };

    if (!requestId) {
      return NextResponse.json(
        { error: "requestId ontbreekt" },
        { status: 400 }
      );
    }

    /* ===============================
       1. Upgrade request ophalen
       =============================== */
    const { data: request, error: fetchError } =
      await supabaseAdmin
        .from("club_upgrade_requests")
        .select(
          `
          id,
          status,
          requested_package,
          club_id,
          clubs:club_id (
            id,
            name,
            email,
            subscription_status
          )
        `
        )
        .eq("id", requestId)
        .maybeSingle();

    if (fetchError || !request) {
      return NextResponse.json(
        { error: "Upgrade aanvraag niet gevonden" },
        { status: 404 }
      );
    }

    if (request.status !== "pending") {
      return NextResponse.json(
        { error: "Deze upgrade is al verwerkt" },
        { status: 400 }
      );
    }

    const club = Array.isArray(request.clubs)
      ? request.clubs[0]
      : request.clubs;

    if (!club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    /* ===============================
       2. Upgrade request → rejected
       =============================== */
    const { error: requestUpdateError } =
      await supabaseAdmin
        .from("club_upgrade_requests")
        .update({
          status: "rejected",
          rejected_reason: reason || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", requestId);

    if (requestUpdateError) {
      throw requestUpdateError;
    }

    /* ===============================
       3. Club terug naar trial
       =============================== */
    const { error: clubUpdateError } =
      await supabaseAdmin
        .from("clubs")
        .update({
          subscription_status: "trial",
        })
        .eq("id", club.id);

    if (clubUpdateError) {
      throw clubUpdateError;
    }

    /* ===============================
       4. Event loggen
       =============================== */
    await supabaseAdmin
      .from("subscription_events")
      .insert({
        club_id: club.id,
        event_type: "upgrade_rejected",
        old_package: club.subscription_status,
        new_package: null,
      });

    /* ===============================
       5. Mail naar club
       =============================== */
    if (club.email) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        replyTo: process.env.EMAIL_REPLY_TO!,
        to: [club.email],
        subject: "❌ Upgrade aanvraag afgewezen",
        html: `
          <p>Hallo <strong>${club.name}</strong>,</p>

          <p>
            Helaas is jullie aanvraag voor een upgrade
            afgewezen.
          </p>

          ${
            reason
              ? `<p><strong>Reden:</strong><br/>${reason}</p>`
              : `<p>Er is op dit moment besloten om de upgrade niet door te voeren.</p>`
          }

          <p>
            Heb je vragen of wil je dit bespreken?
            Neem gerust contact met ons op.
          </p>

          <p>
            Sportieve groet,<br/>
            <strong>Michiel van den Berg</strong><br/>
            Sponsorjobs
          </p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ reject-upgrade error:", err);
    return NextResponse.json(
      { error: "Interne serverfout" },
      { status: 500 }
    );
  }
}
