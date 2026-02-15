export function adminUpgradeRequestEmail(
  clubName: string,
  packageKey: string
) {
  return {
    subject: "Nieuwe club upgrade aanvraag",
    html: `
      <h2>Nieuwe upgrade aanvraag</h2>
      <p><strong>${clubName}</strong> wil upgraden naar <strong>${packageKey}</strong>.</p>
      <p>Ga naar het admin dashboard om de aanvraag te beoordelen.</p>
    `,
  };
}
