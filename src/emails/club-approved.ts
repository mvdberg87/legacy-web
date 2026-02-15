export function clubApprovedEmail(clubName: string, email: string) {
  return {
    subject: "🎉 Je club is goedgekeurd!",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Goed nieuws!</h2>

        <p>
          De club <strong>${clubName}</strong> is zojuist
          <strong>goedgekeurd</strong> op Sponsorjobs.
        </p>

        <p>
          Je kunt nu direct inloggen en aan de slag met het clubdashboard.
        </p>

        <p style="margin: 24px 0;">
          <a
            href="${process.env.NEXT_PUBLIC_SITE_URL}/login"
            style="
              display: inline-block;
              padding: 12px 20px;
              background-color: #2563eb;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
            "
          >
            👉 Inloggen bij Sponsorjobs
          </a>
        </p>

        <p style="font-size: 14px; color: #555;">
          Log in met dit e-mailadres:<br/>
          <strong>${email}</strong>
        </p>

        <p>
          Succes!<br/>
          Team Sponsorjobs
        </p>
      </div>
    `,
  };
}
