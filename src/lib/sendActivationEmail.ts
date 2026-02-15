import { resend } from "@/lib/resend";

export async function sendActivationEmail({
  email,
  clubName,
  token,
}: {
  email: string;
  clubName: string;
  token: string;
}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const claimUrl = `${baseUrl}/onboarding/claim?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: [email],
    subject: `Je club ${clubName} is goedgekeurd`,
    html: `
      <p>Goed nieuws!</p>
      <p>Jullie club <strong>${clubName}</strong> is goedgekeurd.</p>
      <p>
        <a href="${claimUrl}">Klik hier om je club te activeren</a>
      </p>
      <p>Sponsorjobs</p>
    `,
  });
}
