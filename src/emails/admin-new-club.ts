export function adminNewClubEmail(
  clubName: string,
  contactName: string,
  email: string
) {
  return {
    subject: "🆕 Nieuwe club aangemeld",
    html: `
      <h2>Nieuwe club aanmelding</h2>
      <p><strong>Club:</strong> ${clubName}</p>
      <p><strong>Contact:</strong> ${contactName}</p>
      <p><strong>Email:</strong> ${email}</p>

      <p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">
          👉 Ga naar admin dashboard
        </a>
      </p>
    `,
  };
}
