// src/emails/upgrade-approved.ts

export function upgradeApprovedEmail(
  clubName: string,
  packageKey: string
) {
  return {
    subject: "✅ Je upgrade is goedgekeurd",
    html: `
      <h2>Goed nieuws, ${clubName}!</h2>

      <p>
        Jullie upgrade naar het <strong>${packageKey}</strong>-pakket
        is zojuist goedgekeurd door de admin.
      </p>

      <p>
        Je kunt nu direct aan de slag in Sponsorjobs.
      </p>

      <p>
        👉 <a href="${process.env.NEXT_PUBLIC_SITE_URL}/login">
          Inloggen bij Sponsorjobs
        </a>
      </p>

      <p style="margin-top:24px;font-size:12px;color:#666">
        Heb je vragen? Neem gerust contact met ons op.
      </p>
    `,
  };
}
