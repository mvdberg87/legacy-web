import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const {
  type,

  clubId,
  clubName,

  endDate,
  clubEmail,
  reason,

  companyName,
  contactName,
  companyEmail,
  companyWebsite,
  vacancyUrl,

  packageName,
  clubs,

  autoRenew,
} = await req.json();

  // 🔥 club ophalen
  const { data: club } = await supabaseAdmin
    .from("clubs")
    .select("name")
    .eq("id", clubId)
    .single();

  const resolvedClubName =
  clubName ||
  club?.name ||
  "club";

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

/* ===============================
   ADVERTISEMENT SOLD
=============================== */

if (type === "advertisement_sold") {
  await resend.emails.send({
    from: "Sponsorjobs <info@sponsorjobs.nl>",
    to: "info@sponsorjobs.nl",

    subject: "Nieuwe advertentie verkocht",

    html: `
      <h2>Nieuwe advertentie verkocht</h2>

      <p><strong>Bedrijf:</strong> ${companyName}</p>
      <p><strong>Contactpersoon:</strong> ${contactName}</p>
      <p><strong>E-mail:</strong> ${companyEmail}</p>

      <p><strong>Website:</strong> ${companyWebsite}</p>

      <p><strong>Vacature:</strong></p>
      <p>${vacancyUrl}</p>

      <p><strong>Pakket:</strong> ${packageName}</p>

      <p><strong>Clubs:</strong></p>

      <ul>
        ${
          clubs?.map(
            (club: string) =>
              `<li>${club}</li>`
          ).join("") || ""
        }
      </ul>

      <p>
        Actie vereist:
        advertentie controleren en activeren.
      </p>
    `,
  });
}

/* ===============================
   ADVERTISEMENT CONFIRMATION
=============================== */

if (
  type ===
  "advertisement_confirmation"
) {
  await resend.emails.send({
    from: "Sponsorjobs <info@sponsorjobs.nl>",

    to: companyEmail,

    subject:
      "Bedankt voor uw aankoop",

    html: `
      <p>Beste ${contactName},</p>

      <p>
        Bedankt voor uw aankoop via Sponsorjobs.
      </p>

      <p>
        Wij controleren uw advertentie
        en activeren deze binnen
        1 werkdag.
      </p>

      <p>
        Zodra de advertentie actief is,
        ontvangt u hiervan bericht.
      </p>

      <p>
        Met sportieve groet,
      </p>

      <p>
        Team Sponsorjobs
      </p>
    `,
  });
}

/* ===============================
   ADVERTISEMENT ACTIVATED
=============================== */

if (
  type ===
  "advertisement_activated"
) {
  await resend.emails.send({
    from: "Sponsorjobs <info@sponsorjobs.nl>",

    to: companyEmail,

    subject:
      "Uw advertentie is geactiveerd",

    html: `
      <p>Beste ${contactName || "relatie"},</p>

      <p>
        Uw advertentie is gecontroleerd
        en geactiveerd.
      </p>

      <p>
        De vacature is nu zichtbaar op
        Sponsorjobs.
      </p>

      <p>
        Bedankt voor uw vertrouwen.
      </p>

      <p>
        Team Sponsorjobs
      </p>
    `,
  });
}

/* ===============================
   ADVERTISEMENT REJECTED
=============================== */

if (
  type ===
  "advertisement_rejected"
) {
  await resend.emails.send({
    from: "Sponsorjobs <info@sponsorjobs.nl>",

    to: companyEmail,

    subject:
      "Aanvullende informatie nodig",

    html: `
      <p>Beste ${contactName || companyName},</p>

      <p>
        Bedankt voor uw aanvraag via Sponsorjobs.
      </p>

      <p>
        Op dit moment kunnen wij de
        advertentie nog niet activeren.
      </p>

      <p>
        <strong>Reden:</strong>
      </p>

      <p>
        ${reason}
      </p>

      <p>
        Zodra dit is aangepast,
        beoordelen wij de advertentie
        opnieuw.
      </p>

      <p>
        Team Sponsorjobs
      </p>
    `,
  });
}

/* ===============================
   ADVERTISEMENT REMINDER 90
=============================== */

if (
  type ===
  "advertisement_reminder_90"
) {
  await resend.emails.send({
    from:
      "Sponsorjobs <info@sponsorjobs.nl>",

    to: companyEmail,

    subject:
      "Uw advertentie verloopt over 90 dagen",

    html: `
      <p>Beste ${companyName},</p>

      <p>
        Uw advertentie bij
        ${resolvedClubName}
        verloopt op
        ${new Date(endDate).toLocaleDateString("nl-NL")}.
      </p>

      ${
        autoRenew
          ? `
        <p>
          Deze advertentie wordt
          automatisch verlengd,
          tenzij u vóór de einddatum
          aangeeft te willen stoppen.
        </p>
      `
          : ""
      }

      <p>
        Team Sponsorjobs
      </p>
    `,
  });
}

/* ===============================
   ADVERTISEMENT REMINDER 60
=============================== */

if (
  type ===
  "advertisement_reminder_60"
) {
  await resend.emails.send({
    from:
      "Sponsorjobs <info@sponsorjobs.nl>",

    to: companyEmail,

    subject:
      "Uw advertentie verloopt over 60 dagen",

    html: `
      <p>Beste ${companyName},</p>

      <p>
        Uw advertentie bij
        ${resolvedClubName}
        verloopt op
        ${new Date(endDate).toLocaleDateString("nl-NL")}.
      </p>

      ${
        autoRenew
          ? `
        <p>
          Deze advertentie wordt
          automatisch verlengd,
          tenzij u vóór de einddatum
          aangeeft te willen stoppen.
        </p>
      `
          : ""
      }

      <p>
        Team Sponsorjobs
      </p>
    `,
  });
}

/* ===============================
   ADVERTISEMENT REMINDER 30
=============================== */

if (
  type ===
  "advertisement_reminder_30"
) {
  await resend.emails.send({
    from:
      "Sponsorjobs <info@sponsorjobs.nl>",

    to: companyEmail,

    subject:
      "Uw advertentie verloopt over 30 dagen",

    html: `
      <p>Beste ${companyName},</p>

      <p>
        Uw advertentie bij
        ${resolvedClubName}
        verloopt op
        ${new Date(endDate).toLocaleDateString("nl-NL")}.
      </p>

      ${
        autoRenew
          ? `
        <p>
          Deze advertentie wordt
          automatisch verlengd,
          tenzij u vóór de einddatum
          aangeeft te willen stoppen.
        </p>
      `
          : ""
      }

      <p>
        Team Sponsorjobs
      </p>
    `,
  });
}

/* ===============================
   ADVERTISEMENT RENEWED
=============================== */

if (
  type ===
  "advertisement_renewed"
) {
  await resend.emails.send({
    from:
      "Sponsorjobs <info@sponsorjobs.nl>",

    to: companyEmail,

    subject:
      "Uw advertentie is verlengd",

    html: `
      <p>Beste ${companyName},</p>

      <p>
        Uw advertentie bij
        ${clubName}
        is automatisch
        verlengd met 12 maanden.
      </p>

      <p>
        Nieuwe einddatum:
        ${new Date(endDate)
          .toLocaleDateString("nl-NL")}
      </p>

      <p>
        Team Sponsorjobs
      </p>
    `,
  });
}

  return Response.json({ ok: true });
}