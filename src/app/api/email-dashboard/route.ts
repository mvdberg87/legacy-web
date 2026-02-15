import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { clubName, clubSlug, email, days, stats } = await req.json();

    const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/club/${clubSlug}/dashboard`;

    const totalLikes = stats?.reduce((sum: number, s: any) => sum + (s.likes || 0), 0) || 0;
    const totalClicks = stats?.reduce((sum: number, s: any) => sum + (s.clicks || 0), 0) || 0;
    const totalJobs = stats?.length || 0;

    // 🎨 Sponsorjobs-kleuren
    const primary = "#001F54"; // Sponsorjobs navy
    const accent = "#D4AF37"; // Goudaccent
    const text = "#111111";
    const bg = "#f9f9f9";

    const periodLabel = days === 0 ? "Alle data" : `Laatste ${days} dagen`;

    // 📧 HTML-template
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: ${bg}; padding: 24px; color: ${text};">
        <table style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="background-color: ${primary}; padding: 20px; text-align: center;">
              <img src="https://sponsuls.nl/wp-content/uploads/2024/05/Sponsuls-logo-wit.png" alt="Sponsuls" style="height: 40px;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <h2 style="color: ${primary}; margin-top: 0;">📊 Dashboardrapport voor ${clubName}</h2>
              <p style="margin-bottom: 16px;">Beste sponsorcommissie,</p>
              <p>Hieronder vind je een samenvatting van de huidige cijfers:</p>
              
              <table style="margin: 16px 0; width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Periode:</td>
                  <td>${periodLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Totaal likes:</td>
                  <td>${totalLikes}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Totaal clicks:</td>
                  <td>${totalClicks}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Aantal vacatures:</td>
                  <td>${totalJobs}</td>
                </tr>
              </table>

              <p style="margin-top: 24px;">Je kunt de volledige details bekijken via onderstaande link:</p>
              <p>
                <a href="${dashboardUrl}" 
                   style="background-color: ${primary}; color: white; text-decoration: none; 
                          padding: 12px 24px; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Bekijk dashboard
                </a>
              </p>

              <p style="margin-top: 32px; font-size: 13px; color: #555;">
                Met sportieve groet,<br>
                <strong>Sponsorjobs</strong><br>
                <span style="color:${accent};">Samen Sterker in Sponsoring</span>
              </p>
            </td>
          </tr>
        </table>

        <p style="text-align: center; font-size: 12px; color: #888; margin-top: 16px;">
          Deze mail is automatisch verzonden via Sponsorjobs Dashboard.<br>
          Voor vragen, neem contact op via <a href="mailto:info@sponsorjobs.nl">info@sponsorjobs.nl</a>.
        </p>
      </div>
    `;

    // 📤 Verstuur via Resend
    const { error } = await resend.emails.send({
      from: "Sponsorjobs Dashboard <no-reply@sponsorjobs.nl>",
      to: [email],
      cc: ["rapport@sponsorjobs.nl"],
      subject: `📊 Dashboardrapport ${clubName} – ${periodLabel}`,
      html,
    });

    if (error) {
      console.error("Email error:", error);
      return NextResponse.json({ ok: false, error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Email route error:", e);
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}
