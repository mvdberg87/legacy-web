import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendCancellationEmail({
  clubName,
  clubEmail,
}: {
  clubName: string;
  clubEmail: string;
}) {
  await resend.emails.send({
    from: "Sponsorjobs <info@sponsorjobs.nl>",
    to: clubEmail,
    subject: "Je opzegging is ontvangen",
    html: `
      <p>Hi ${clubName},</p>

      <p>We hebben je opzegging goed ontvangen — jammer dat je (voor nu) stopt.</p>

      <p>Goed om te weten:</p>
      <ul>
        <li>Je account blijft nog actief tot het einde van de periode</li>
        <li>Daarna blijft je data nog 30 dagen bewaard</li>
        <li>Je kunt in die periode altijd je opzegging annuleren</li>
      </ul>

      <p>Mocht je je bedenken, dan staat alles nog voor je klaar 🙌</p>

      <p>Groet,<br/>Team Sponsorjobs</p>
    `,
  });
}