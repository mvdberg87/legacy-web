// src/app/api/stripe/payment-confirmed/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type PackageKey = "basic" | "plus" | "pro" | "unlimited";

export async function POST(req: NextRequest) {
  try {
    const {
      clubId,
      packageKey,
      stripeSubscriptionId,
    } = (await req.json()) as {
      clubId?: string;
      packageKey?: PackageKey;
      stripeSubscriptionId?: string;
    };

    if (!clubId || !packageKey || !stripeSubscriptionId) {
      return NextResponse.json(
        { error: "clubId, packageKey en stripeSubscriptionId zijn verplicht" },
        { status: 400 }
      );
    }

    /* ===============================
       1. Club ophalen
       =============================== */
    const { data: club, error: clubError } = await supabase
      .from("clubs")
      .select(
        `
        id,
        name,
        email,
        subscription_status,
        active_package,
        stripe_subscription_id
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

    /* ===============================
       2. 🔁 Idempotency check
       =============================== */
    if (club.subscription_status === "active") {
      return NextResponse.json({
        success: true,
        alreadyActive: true,
      });
    }

    /* ===============================
       3. Start- & einddatum bepalen
       =============================== */
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    /* ===============================
       4. Club activeren
       =============================== */
    const { error: updateError } = await supabase
      .from("clubs")
      .update({
        subscription_status: "active",
        active_package: packageKey,
        subscription_start: startDate.toISOString(),
        subscription_end: endDate.toISOString(),
        stripe_subscription_id: stripeSubscriptionId,
        subscription_renewal_pending: false,
        cancelled_at: null,
        blocked_at: null,
      })
      .eq("id", club.id);

    if (updateError) {
      throw updateError;
    }

    /* ===============================
       5. Event loggen
       =============================== */
    await supabase.from("subscription_events").insert({
      club_id: club.id,
      event_type: "payment_confirmed",
      old_package: club.active_package,
      new_package: packageKey,
      period_start: startDate.toISOString(),
      period_end: endDate.toISOString(),
    });

    /* ===============================
       6. Mail: abonnement actief
       =============================== */
    if (club.email) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        replyTo: process.env.EMAIL_REPLY_TO!,
        to: [club.email],
        subject: "✅ Jullie abonnement is nu actief",
        html: `
          <p>Hallo <strong>${club.name}</strong>,</p>

          <p>
            De betaling is succesvol afgerond en jullie abonnement is nu actief.
          </p>

          <p>
            <strong>Pakket:</strong> ${packageKey}<br/>
            <strong>Ingangsdatum:</strong> ${startDate.toLocaleDateString("nl-NL")}<br/>
            <strong>Einddatum:</strong> ${endDate.toLocaleDateString("nl-NL")}
          </p>

          <p>
            👉 <a href="${process.env.NEXT_PUBLIC_SITE_URL}/login">
              Ga naar het dashboard
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ payment-confirmed error:", err);
    return NextResponse.json(
      { error: "Interne serverfout" },
      { status: 500 }
    );
  }
}
