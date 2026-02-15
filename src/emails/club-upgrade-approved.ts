export function upgradeApprovedEmail(clubName: string, packageKey: string) {
  return {
    subject: "🚀 Upgrade geactiveerd",
    html: `
      <h2>Upgrade succesvol geactiveerd</h2>
      <p>Beste ${clubName},</p>

      <p>Jullie upgrade naar <strong>${packageKey}</strong> is goedgekeurd.</p>

      <p>Je kunt direct gebruikmaken van de nieuwe functionaliteiten.</p>

      <p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/login">
          👉 Inloggen
        </a>
      </p>
    `,
  };
}
