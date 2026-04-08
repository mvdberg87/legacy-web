import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const { type, clubId, endDate, clubEmail, reason } = await req.json();;

  // 🔥 club ophalen
  const { data: club } = await supabaseAdmin
    .from("clubs")
    .select("name")
    .eq("id", clubId)
    .single();

  const clubName = club?.name || "club";

  /* ===============================
     CLUB MAIL
  =============================== */

  if (type === "subscription_cancelled" && clubEmail) {
    await resend.emails.send({
      from: "Sponsorjobs <info@sponsorjobs.nl>",
      to: clubEmail,
      subject: "Je opzegging is ontvangen",
      html: `
        <p>Hi ${clubName},</p>

        <p>We hebben je opzegging goed ontvangen.</p>

        <p>
          Je abonnement loopt nog door tot <strong>${new Date(endDate).toLocaleDateString("nl-NL")}</strong>.
        </p>

        ${reason ? `<p>Reden van opzegging: ${reason}</p>` : ""}

        <p>
          – Je kunt je opzegging altijd annuleren<br/>
          – Je data blijft nog 30 dagen beschikbaar
        </p>

        <p>We vinden het jammer om je te zien gaan.</p>

        <p>Team Sponsorjobs</p>
      `,
    });
  }

  /* ===============================
     ADMIN MAIL
  =============================== */

  if (type === "admin_subscription_cancelled") {
    await resend.emails.send({
      from: "Sponsorjobs <info@sponsorjobs.nl>",
      to: "info@sponsorjobs.nl", // 🔥 jouw mail
      subject: "Club heeft opgezegd",
      html: `
        <p>Club: ${clubName}</p>
        <p>Einddatum: ${new Date(endDate).toLocaleDateString("nl-NL")}</p>
      `,
    });
  }

  return Response.json({ ok: true });
}