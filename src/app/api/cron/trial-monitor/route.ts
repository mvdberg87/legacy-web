// src/app/api/cron/trial-monitor/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    // 🔐 simpele beveiliging
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    const { data: clubs, error } = await supabaseAdmin
      .from("clubs")
      .select("*")
      .eq("subscription_status", "trial")
      .not("subscription_end", "is", null);

    if (error) {
      console.error("❌ Clubs ophalen mislukt:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    for (const club of clubs ?? []) {
      const end = new Date(club.subscription_end);
      const diffDays =
        Math.ceil(
          (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

      /* ===============================
         📩 MAIL 1 – 14 dagen
         =============================== */
      if (
        diffDays <= 14 &&
        diffDays > 7 &&
        !club.trial_mail_14_sent_at
      ) {
        await sendMail(
          club.email,
          "⏳ Je proefperiode loopt bijna af",
          mail14Days(club.name)
        );

        await supabaseAdmin
          .from("clubs")
          .update({ trial_mail_14_sent_at: now.toISOString() })
          .eq("id", club.id);
      }

      /* ===============================
         📩 MAIL 2 – 7 dagen
         =============================== */
      if (
        diffDays <= 7 &&
        diffDays > 0 &&
        !club.trial_mail_7_sent_at
      ) {
        await sendMail(
          club.email,
          "⚠️ Nog 7 dagen proefperiode",
          mail7Days(club.name)
        );

        await supabaseAdmin
          .from("clubs")
          .update({ trial_mail_7_sent_at: now.toISOString() })
          .eq("id", club.id);
      }

      /* ===============================
         🚫 TRIAL VERLOPEN
         =============================== */
      if (diffDays <= 0 && !club.trial_mail_expired_sent_at) {
        await sendMail(
          club.email,
          "🚫 Je account is tijdelijk geblokkeerd",
          mailExpired(club.name)
        );

        await supabaseAdmin
          .from("clubs")
          .update({
            trial_mail_expired_sent_at: now.toISOString(),
            subscription_status: "blocked",
          })
          .eq("id", club.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Trial cron error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ===============================
   Mail helpers
   =============================== */

async function sendMail(to: string, subject: string, html: string) {
  if (!to) return;

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    replyTo: process.env.EMAIL_REPLY_TO!,
    to: [to],
    subject,
    html,
  });
}

function mail14Days(name: string) {
  return `
    <p>Hallo <strong>${name}</strong>,</p>
    <p>Over <strong>14 dagen</strong> loopt jullie proefperiode af.</p>
    <p>Wil je ononderbroken gebruik blijven maken van het platform?</p>
    <p>
      👉 Upgrade via het dashboard<br/>
      Of neem contact op via <a href="mailto:info@sponsorjobs.nl">
      info@sponsorjobs.nl</a>
    </p>
  `;
}

function mail7Days(name: string) {
  return `
    <p>Hallo <strong>${name}</strong>,</p>
    <p>Jullie proefperiode loopt over <strong>7 dagen</strong> af.</p>
    <p>Zonder upgrade wordt het account tijdelijk geblokkeerd.</p>
    <p>
      👉 Upgrade nu of mail
      <a href="mailto:info@sponsorjobs.nl">
      info@sponsorjobs.nl</a>
    </p>
  `;
}

function mailExpired(name: string) {
  return `
    <p>Hallo <strong>${name}</strong>,</p>
    <p>De proefperiode is verlopen en het account is tijdelijk geblokkeerd.</p>
    <p>
      Neem contact op om te upgraden:
      <a href="mailto:info@sponsorjobs.nl">
      info@sponsorjobs.nl</a>
    </p>
  `;
}
