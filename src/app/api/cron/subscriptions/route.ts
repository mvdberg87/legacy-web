// src/app/api/cron/subscriptions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    /* ===============================
       🔐 Security check
       =============================== */
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const now = new Date().toISOString();

    /* ===============================
       1. Opgezegde abonnementen verlopen
          → EXPIRED
       =============================== */
    const { data: expiredPaid, error: paidError } =
      await supabaseAdmin
        .from("clubs")
        .select(
          "id, name, email, subscription_end"
        )
        .eq("subscription_status", "cancelled")
        .not("subscription_cancelled_at", "is", null)
        .lt("subscription_end", now);

    if (paidError) {
      console.error("❌ Opgezegde abonnementen ophalen mislukt:", paidError);
      throw paidError;
    }

    for (const club of expiredPaid ?? []) {
      await supabaseAdmin
        .from("clubs")
        .update({
          subscription_status: "expired",
        })
        .eq("id", club.id);

      /* ===============================
         📩 Mail – abonnement verlopen
         =============================== */
      if (club.email) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          replyTo: process.env.EMAIL_REPLY_TO!,
          to: [club.email],
          subject: "🔒 Abonnement verlopen",
          html: `
            <p>Hallo <strong>${club.name}</strong>,</p>

            <p>
              Jullie abonnement is verlopen. Het account is nu
              geblokkeerd.
            </p>

            <p>
              Wil je het abonnement opnieuw activeren?
              Neem contact op via
              <a href="mailto:info@sponsorjobs.nl">
                info@sponsorjobs.nl
              </a>
            </p>

            <p>Sportieve groet,<br/>Sponsorjobs</p>
          `,
        });
      }
    }

    /* ===============================
       Klaar
       =============================== */
    return NextResponse.json({
      success: true,
      expired_paid: expiredPaid?.length ?? 0,
    });
  } catch (err) {
    console.error("❌ CRON subscription error:", err);
    return NextResponse.json(
      { error: "Cron failed" },
      { status: 500 }
    );
  }
}
