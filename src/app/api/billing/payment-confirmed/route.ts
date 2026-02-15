// src/app/api/billing/payment-confirmed/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { clubId } = (await req.json()) as {
      clubId?: string;
    };

    if (!clubId) {
      return NextResponse.json(
        { error: "clubId ontbreekt" },
        { status: 400 }
      );
    }

    /* ===============================
       1. Club ophalen
       =============================== */
    const { data: club, error: clubError } =
      await supabaseAdmin
        .from("clubs")
        .select(
          `
          id,
          name,
          email,
          subscription_status
        `
        )
        .eq("id", clubId)
        .single();

    if (clubError || !club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    if (club.subscription_status !== "awaiting_payment") {
      return NextResponse.json(
        {
          error:
            "Betaling kan alleen bevestigd worden vanuit awaiting_payment",
        },
        { status: 409 }
      );
    }

    /* ===============================
       2. Laatste goedgekeurde upgrade ophalen
       =============================== */
    const { data: upgrade, error: upgradeError } =
      await supabaseAdmin
        .from("club_upgrade_requests")
        .select(
          `
          id,
          requested_package
        `
        )
        .eq("club_id", club.id)
        .eq("status", "approved")
        .order("reviewed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (upgradeError || !upgrade) {
      return NextResponse.json(
        { error: "Geen goedgekeurde upgrade gevonden" },
        { status: 404 }
      );
    }

    const now = new Date();
    const startDate = now.toISOString();
    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 1);

    /* ===============================
       3. Club activeren
       =============================== */
    await supabaseAdmin
      .from("clubs")
      .update({
        subscription_status: "active",
        active_package: upgrade.requested_package,
        subscription_start: startDate,
        subscription_end: endDate.toISOString(),
        package_status: "active",
      })
      .eq("id", club.id);

    /* ===============================
       4. Upgrade afronden
       =============================== */
    await supabaseAdmin
      .from("club_upgrade_requests")
      .update({
        status: "completed",
      })
      .eq("id", upgrade.id);

    /* ===============================
       5. Event loggen
       =============================== */
    await supabaseAdmin
      .from("subscription_events")
      .insert({
        club_id: club.id,
        event_type: "subscription_activated",
        old_package: null,
        new_package: upgrade.requested_package,
        period_start: startDate,
        period_end: endDate.toISOString(),
      });

    /* ===============================
       6. MAIL 4 – Abonnement actief
       =============================== */
    if (club.email) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        replyTo: process.env.EMAIL_REPLY_TO!,
        to: [club.email],
        subject:
          "Welkom! Jullie abonnement is nu actief",
        html: `
          <p>Hallo <strong>${club.name}</strong>,</p>

          <p>
            De betaling is succesvol afgerond en het
            abonnement is nu actief.
          </p>

          <p>
            <strong>Pakket:</strong> ${upgrade.requested_package}<br/>
            <strong>Ingangsdatum:</strong> ${new Date(
              startDate
            ).toLocaleDateString("nl-NL")}<br/>
            <strong>Einddatum:</strong> ${endDate.toLocaleDateString(
              "nl-NL"
            )}
          </p>

          <p>
            Je kunt nu volledig gebruikmaken van alle
            functionaliteiten binnen het platform.
          </p>

          <p>
            👉 <a href="${process.env.NEXT_PUBLIC_SITE_URL}/login">
              <strong>Ga naar het dashboard</strong>
            </a>
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
      status: "active",
    });
  } catch (err) {
    console.error(
      "❌ payment-confirmed error:",
      err
    );
    return NextResponse.json(
      { error: "Interne serverfout" },
      { status: 500 }
    );
  }
}