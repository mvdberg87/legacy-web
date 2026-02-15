// src/app/api/admin/approve-upgrade/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

type AllowedPackage = "basic" | "plus" | "pro" | "unlimited";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requestId: string | undefined = body?.requestId;

    if (!requestId) {
      return NextResponse.json(
        { error: "requestId ontbreekt" },
        { status: 400 }
      );
    }

    /* ===============================
       1. Upgrade request ophalen
       =============================== */
    const { data: upgrade, error: fetchError } =
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
            subscription_status,
            blocked_at,
            cancelled_at
          )
        `
        )
        .eq("id", requestId)
        .maybeSingle();

    if (fetchError || !upgrade) {
      return NextResponse.json(
        { error: "Upgrade aanvraag niet gevonden" },
        { status: 404 }
      );
    }

    if (upgrade.status !== "pending") {
      return NextResponse.json(
        { error: "Deze upgrade is al verwerkt" },
        { status: 400 }
      );
    }

    const targetPackage =
      upgrade.requested_package as AllowedPackage | null;

    if (
      !targetPackage ||
      !["basic", "plus", "pro", "unlimited"].includes(
        targetPackage
      )
    ) {
      return NextResponse.json(
        { error: "Ongeldig of ontbrekend pakket" },
        { status: 400 }
      );
    }

    const club = Array.isArray(upgrade.clubs)
      ? upgrade.clubs[0]
      : upgrade.clubs;

    if (!club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    /* ===============================
       2. Veiligheidschecks
       =============================== */
    if (club.blocked_at) {
      return NextResponse.json(
        { error: "Club is geblokkeerd" },
        { status: 409 }
      );
    }

    if (club.cancelled_at) {
      return NextResponse.json(
        { error: "Abonnement is opgezegd" },
        { status: 409 }
      );
    }

    if (club.subscription_status !== "pending_upgrade") {
      return NextResponse.json(
        {
          error:
            "Club staat niet in status pending_upgrade",
        },
        { status: 409 }
      );
    }

    /* ===============================
       3. Club → awaiting_payment
       =============================== */
    await supabaseAdmin
      .from("clubs")
      .update({
        subscription_status: "awaiting_payment",
        approved_at: new Date().toISOString(),
      })
      .eq("id", club.id);

    /* ===============================
       4. Upgrade request → approved
       =============================== */
    await supabaseAdmin
      .from("club_upgrade_requests")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    /* ===============================
       5. Event loggen
       =============================== */
    await supabaseAdmin
      .from("subscription_events")
      .insert({
        club_id: club.id,
        event_type: "upgrade_approved",
        old_package: club.subscription_status,
        new_package: targetPackage,
      });

    /* ===============================
       6. MAIL 2 – Upgrade goedgekeurd
       =============================== */
    if (club.email) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        replyTo: process.env.EMAIL_REPLY_TO!,
        to: [club.email],
        subject:
          "Jullie upgrade is goedgekeurd – regel nu de betaling",
        html: `
          <p>Hallo <strong>${club.name}</strong>,</p>

          <p>
            Goed nieuws! Jullie upgrade naar het pakket
            <strong>${targetPackage}</strong> is goedgekeurd.
          </p>

          <p>
            Om het abonnement te activeren, vragen we jullie
            om de betaling te regelen.
          </p>

          <p>
            👉 <a href="${process.env.NEXT_PUBLIC_SITE_URL}/club/billing">
              <strong>Regel betaling</strong>
            </a>
          </p>

          <p>
            Na afronding van de betaling wordt het abonnement
            automatisch geactiveerd.
          </p>

          <p>
            Met sportieve groet,<br/>
            <strong>Michiel van den Berg</strong><br/>
            Sponsorjobs
          </p>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      next_status: "awaiting_payment",
    });
  } catch (err) {
    console.error("❌ approve-upgrade error:", err);
    return NextResponse.json(
      { error: "Interne serverfout" },
      { status: 500 }
    );
  }
}
