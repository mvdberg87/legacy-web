import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

export async function GET() {
  const now = new Date();

  const { data: clubs } = await supabaseAdmin
    .from("clubs")
    .select("*")
    .in("subscription_status", ["trial", "active", "cancelled"]);

  for (const club of clubs ?? []) {
    const start = club.subscription_start
      ? new Date(club.subscription_start)
      : null;
    const end = club.subscription_end
      ? new Date(club.subscription_end)
      : null;

    if (!start || !end) continue;

    const daysLeft =
      Math.ceil(
        (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

    /* ===============================
       TRIAL FLOW
       =============================== */
    if (club.subscription_status === "trial") {
      if (daysLeft === 14) {
        await sendOnce(club, "trial_14_days", `
          <p>Je proefperiode loopt over 2 weken af.</p>
          <p>Upgrade nu naar Plus om actief te blijven.</p>
        `);
      }

      if (daysLeft === 7) {
        await sendOnce(club, "trial_7_days", `
          <p>Laatste week van je proefperiode.</p>
          <p>Upgrade om blokkade te voorkomen.</p>
        `);
      }

      if (daysLeft === 0) {
        await sendOnce(club, "trial_expired", `
          <p>Je proefperiode is afgelopen.</p>
          <p>Je account wordt binnenkort geblokkeerd.</p>
        `);
      }

      if (daysLeft < -7) {
        await supabaseAdmin
          .from("clubs")
          .update({
            subscription_status: "blocked",
            blocked_at: now.toISOString(),
            data_delete_after: new Date(
              now.setFullYear(now.getFullYear() + 1)
            ).toISOString(),
          })
          .eq("id", club.id);

        await sendOnce(
          club,
          "trial_blocked",
          `
          <p>Je account is geblokkeerd.</p>
          <p>
            Neem contact op via
            <a href="mailto:info@sponsorjobs.nl">
              info@sponsorjobs.nl
            </a>
          </p>
        `
        );
      }
    }

    /* ===============================
       PAID AUTO-RENEW
       =============================== */
    if (club.subscription_status === "active" && daysLeft <= 0) {
      const newStart = new Date(end);
      const newEnd = new Date(end);
      newEnd.setFullYear(newEnd.getFullYear() + 1);

      await supabaseAdmin
        .from("clubs")
        .update({
          subscription_start: newStart.toISOString(),
          subscription_end: newEnd.toISOString(),
        })
        .eq("id", club.id);

      await sendOnce(
        club,
        "renewal_confirmation",
        `<p>Je abonnement is automatisch verlengd.</p>`
      );
    }
  }

  return NextResponse.json({ success: true });
}

/* ===============================
   Helper: mail 1x versturen
   =============================== */
async function sendOnce(
  club: any,
  type: string,
  html: string
) {
  const { data: existing } = await supabaseAdmin
    .from("subscription_notifications")
    .select("id")
    .eq("club_id", club.id)
    .eq("notification_type", type)
    .maybeSingle();

  if (existing) return;

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: [club.email],
    subject: "Bericht over je abonnement",
    html,
  });

  await supabaseAdmin.from("subscription_notifications").insert({
    club_id: club.id,
    notification_type: type,
  });
}
