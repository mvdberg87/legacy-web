// src/app/api/club/request-upgrade/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

/* ===============================
   Subscription order (GEEN downgrade)
   =============================== */

const PACKAGE_ORDER: Record<
  "basic" | "plus" | "pro" | "unlimited",
  number
> = {
  basic: 1,
  plus: 2,
  pro: 3,
  unlimited: 4,
};

export async function POST(req: NextRequest) {
  try {
    const { clubId, packageKey } = (await req.json()) as {
      clubId?: string;
      packageKey?: "basic" | "plus" | "pro" | "unlimited";
    };

    if (!clubId || !packageKey) {
      return NextResponse.json(
        { error: "clubId of packageKey ontbreekt" },
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
          "id, name, email, active_package, subscription_status"
        )
        .eq("id", clubId)
        .maybeSingle();

    if (clubError || !club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    if (!club.active_package) {
      return NextResponse.json(
        { error: "Huidig pakket van club onbekend" },
        { status: 400 }
      );
    }

    /* ===============================
       2. Status-check (BELANGRIJK)
       =============================== */
    if (
      club.subscription_status === "blocked" ||
      club.subscription_status === "expired"
    ) {
      return NextResponse.json(
        {
          error:
            "Deze club mag geen upgrade aanvragen.",
        },
        { status: 400 }
      );
    }

    /* ===============================
       3. Geen downgrade toestaan
       =============================== */
    const currentOrder =
      PACKAGE_ORDER[club.active_package];
    const requestedOrder =
      PACKAGE_ORDER[packageKey];

    if (requestedOrder < currentOrder) {
      return NextResponse.json(
        {
          error:
            "Downgraden is niet toegestaan tijdens de looptijd van het abonnement.",
        },
        { status: 400 }
      );
    }

    if (requestedOrder === currentOrder) {
      return NextResponse.json(
        {
          error:
            "Dit pakket is al actief. Kies een hoger pakket om te upgraden.",
        },
        { status: 400 }
      );
    }

    /* ===============================
       4. Check: bestaande upgrade?
       =============================== */
    const { data: existingRequest, error: existingError } =
      await supabaseAdmin
        .from("club_upgrade_requests")
        .select("id, status")
        .eq("club_id", club.id)
        .eq("status", "pending")
        .limit(1)
        .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { error: "Kon bestaande upgrade niet controleren" },
        { status: 500 }
      );
    }

    if (existingRequest) {
      return NextResponse.json(
        {
          error:
            "Er is al een upgrade-aanvraag in behandeling.",
        },
        { status: 400 }
      );
    }

    /* ===============================
       5. Upgrade request aanmaken
       =============================== */
    const { data: request, error: insertError } =
      await supabaseAdmin
        .from("club_upgrade_requests")
        .insert({
          club_id: club.id,
          current_package: club.active_package,
          requested_package: packageKey,
          status: "pending",
        })
        .select()
        .single();

    if (insertError || !request) {
      return NextResponse.json(
        { error: "Upgrade aanvraag mislukt" },
        { status: 500 }
      );
    }

    /* ===============================
       6. MAIL – Bevestiging aan club
       =============================== */
    if (club.email) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        replyTo: process.env.EMAIL_REPLY_TO!,
        to: [club.email],
        subject:
          "We hebben jullie upgrade-aanvraag ontvangen",
        html: `
          <p>Hallo <strong>${club.name}</strong>,</p>

          <p>
            Bedankt voor jullie aanvraag om te upgraden naar
            het pakket <strong>${packageKey}</strong>.
          </p>

          <p>
            We hebben de aanvraag goed ontvangen en nemen
            deze momenteel in behandeling.
          </p>

          <p>
            Zodra er een beslissing is genomen, brengen we
            jullie direct op de hoogte.
          </p>

          <p>
            Met sportieve groet,<br/>
            <strong>Sponsorjobs</strong>
          </p>
        `,
      });
    }

    /* ===============================
       7. MAIL – Admin notificatie
       =============================== */
    const adminEmail =
      process.env.SPONSORJOBS_ADMIN_EMAILS;

    if (adminEmail) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        replyTo: process.env.EMAIL_REPLY_TO!,
        to: [adminEmail],
        subject: "🔔 Nieuwe upgrade aanvraag",
        html: `
          <p><strong>Club:</strong> ${club.name}</p>
          <p><strong>Huidig pakket:</strong> ${club.active_package}</p>
          <p><strong>Aangevraagd pakket:</strong> ${packageKey}</p>

          <p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/upgrades">
              👉 Beoordeel aanvraag in admin
            </a>
          </p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ request-upgrade error:", err);
    return NextResponse.json(
      { error: "Interne serverfout" },
      { status: 500 }
    );
  }
}
