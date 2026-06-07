import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { SUBSCRIPTIONS } from "@/lib/subscriptions";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const now = new Date();

    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const firstDayMonthBefore = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    const {
  data: clubs,
  error: clubsError,
} = await supabaseAdmin
  .from("clubs")
  .select(`
    id,
    name,
    slug,
    email,
    active_package,
    advertising_sales_enabled,
    status
  `)
  .eq("status", "approved");

console.log(
  "MONTHLY REPORT CLUBS:",
  clubs?.length
);

console.log(
  "MONTHLY REPORT ERROR:",
  clubsError
);

    for (const club of clubs ?? []) {
      console.log("PROCESSING CLUB:", club.name);

      /* ===============================
         Email fallback (club → profile)
      =============================== */

      let email = club.email;

      if (!email) {
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("email")
          .eq("club_id", club.id)
          .eq("active", true)
          .limit(1)
          .maybeSingle();

        email = profile?.email;
      }

      if (!email || !email.includes("@")) {

  console.log(
    "SKIP INVALID EMAIL:",
    club.name,
    email
  );

  continue;
}

      /* ===============================
         Duplicate check
      =============================== */

      const monthKey = firstDayLastMonth.toISOString();

      const { data: existing } = await supabaseAdmin
        .from("monthly_reports")
        .select("id")
        .eq("club_id", club.id)
        .eq("month", monthKey)
        .maybeSingle();

      if (existing) {
        console.log("SKIP: already has report");
        continue;
      }

      /* ===============================
         Jobs ophalen
      =============================== */

      const { data: jobs } = await supabaseAdmin
        .from("jobs")
        .select("id, title, company_name")
        .eq("club_id", club.id)
        .is("archived_at", null);

      const jobIds = jobs?.map((j) => j.id) ?? [];

      console.log(
  "JOBS FOUND:",
  club.name,
  jobIds.length
);

      if (jobIds.length === 0) {

  console.log(
    "SKIP NO JOBS:",
    club.name
  );

  continue;
}

      const jobMap = Object.fromEntries(jobs!.map((j) => [j.id, j]));

      /* ===============================
         Clicks
      =============================== */

      const { data: clicksLastMonth } = await supabaseAdmin
        .from("job_clicks")
        .select("job_id, created_at")
        .in("job_id", jobIds)
        .gte("created_at", firstDayLastMonth.toISOString())
        .lt("created_at", firstDayCurrentMonth.toISOString());

      const { data: clicksMonthBefore } = await supabaseAdmin
        .from("job_clicks")
        .select("job_id")
        .in("job_id", jobIds)
        .gte("created_at", firstDayMonthBefore.toISOString())
        .lt("created_at", firstDayLastMonth.toISOString());

      const totalClicksLastMonth = clicksLastMonth?.length ?? 0;
      const totalClicksMonthBefore = clicksMonthBefore?.length ?? 0;

      /* ===============================
         Pageviews
      =============================== */

      const { data: pageviewsLastMonth } = await supabaseAdmin
        .from("club_page_views")
        .select("created_at")
        .eq("club_id", club.id)
        .gte("created_at", firstDayLastMonth.toISOString())
        .lt("created_at", firstDayCurrentMonth.toISOString());

      const { data: pageviewsMonthBefore } = await supabaseAdmin
        .from("club_page_views")
        .select("created_at")
        .eq("club_id", club.id)
        .gte("created_at", firstDayMonthBefore.toISOString())
        .lt("created_at", firstDayLastMonth.toISOString());

      const totalPageviewsLastMonth = pageviewsLastMonth?.length ?? 0;
      const totalPageviewsMonthBefore = pageviewsMonthBefore?.length ?? 0;

      /* ===============================
         Shares
      =============================== */

      const { data: sharesLastMonth } = await supabaseAdmin
        .from("job_shares")
        .select("job_id")
        .eq("club_id", club.id)
        .gte("created_at", firstDayLastMonth.toISOString())
        .lt("created_at", firstDayCurrentMonth.toISOString());

      const totalSharesLastMonth = sharesLastMonth?.length ?? 0;

      /* ===============================
         Metrics
      =============================== */

      const ctrLastMonth =
        totalPageviewsLastMonth > 0
          ? (totalClicksLastMonth / totalPageviewsLastMonth) * 100
          : 0;

      const ctrMonthBefore =
        totalPageviewsMonthBefore > 0
          ? (totalClicksMonthBefore / totalPageviewsMonthBefore) * 100
          : 0;

      const shareRate =
        totalPageviewsLastMonth > 0
          ? (totalSharesLastMonth / totalPageviewsLastMonth) * 100
          : 0;

      let growth = 0;

      if (totalClicksMonthBefore === 0 && totalClicksLastMonth > 0) {
        growth = 100;
      } else if (totalClicksMonthBefore > 0) {
        growth = Math.round(
          ((totalClicksLastMonth - totalClicksMonthBefore) /
            totalClicksMonthBefore) *
            100
        );
      }

      let ctrGrowth = 0;

      if (ctrMonthBefore === 0 && ctrLastMonth > 0) {
        ctrGrowth = 100;
      } else if (ctrMonthBefore > 0) {
        ctrGrowth = Math.round(
          ((ctrLastMonth - ctrMonthBefore) / ctrMonthBefore) * 100
        );
      }

      /* ===============================
         Sponsor stats
      =============================== */

      const sponsorMap: Record<string, any> = {};

      jobs?.forEach((job) => {
        if (!sponsorMap[job.company_name]) {
          sponsorMap[job.company_name] = { clicks: 0 };
        }
      });

      clicksLastMonth?.forEach((c) => {
        const job = jobMap[c.job_id];
        if (!job) return;
        sponsorMap[job.company_name].clicks++;
      });

      const sponsors = Object.entries(sponsorMap)
        .map(([name, data]: any) => ({
          sponsor: name,
          clicks: data.clicks,
        }))
        .sort((a, b) => b.clicks - a.clicks);

      const topSponsor = sponsors[0] ?? null;

      /* ===============================
         Jobs stats
      =============================== */

      const jobStats =
        jobs?.map((job) => ({
          title: job.title,
          company: job.company_name,
          clicks:
            clicksLastMonth?.filter((c) => c.job_id === job.id).length ?? 0,
        })) ?? [];

      const topJobs = [...jobStats]
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 3);

      const zeroClickJobs = jobStats.filter((j) => j.clicks === 0);

      /* ===============================
         Ads
      =============================== */

      const { count: adsCount } = await supabaseAdmin
        .from("jobs")
        .select("id", { count: "exact", head: true })
        .eq("club_id", club.id)
        .eq("featured", true)
        .is("archived_at", null);

      const maxAds =
        SUBSCRIPTIONS[club.active_package]?.ads ?? 0;

      /* ===============================
         Recommendation
      =============================== */

      let recommendation = "";

      if (zeroClickJobs.length > 0) {
        recommendation = "Je hebt vacatures zonder clicks.";
      } else if (adsCount === maxAds && maxAds !== Infinity) {
        recommendation = "Je advertentieruimte is volledig benut.";
      } else if (ctrLastMonth < 1) {
        recommendation = "Je CTR is laag.";
      } else {
        recommendation = "Sterke prestaties.";
      }

      const monthName = firstDayLastMonth.toLocaleDateString("nl-NL", {
        month: "long",
        year: "numeric",
      });

      const subject =
  `Sponsorjobs Maandrapportage | ${club.name} | ${monthName}`;

      /* ===============================
         SEND MAIL
      =============================== */

      console.log(
  "SENDING REPORT:",
  club.name,
  email
);

      const { error: mailError } = await resend.emails.send({
        from: "Sponsorjobs <no-reply@sponsorjobs.nl>",
        to: email.toLowerCase(),
        subject,
        html: generateHtml({
          club,
          monthName,
          totalClicksLastMonth,
          totalPageviewsLastMonth,
          ctrLastMonth,
          totalSharesLastMonth,
          shareRate,
          growth,
          sponsors,
          topJobs,
          recommendation,
        }),
      });

      if (mailError) {
        console.error(mailError);

        await supabaseAdmin.from("monthly_reports").insert({
          club_id: club.id,
          month: monthKey,
          status: "failed",
        });

        continue;
      }

      await supabaseAdmin.from("monthly_reports").insert({
        club_id: club.id,
        month: monthKey,
        total_clicks: totalClicksLastMonth,
        total_pageviews: totalPageviewsLastMonth,
        total_shares: totalSharesLastMonth,
        ctr: Number(ctrLastMonth.toFixed(1)),
        share_rate: Number(shareRate.toFixed(1)),
        growth,
        status: "sent",
        sent_at: new Date(),
      });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}

/* ===============================
   TEMPLATE
=============================== */

function generateHtml(data: any) {
  const dashboardUrl =
    "https://www.sponsorjobs.nl/login";

  return `
  <div style="
    background:#f4f6f8;
    padding:40px;
    font-family:Arial,sans-serif;
  ">

    <div style="
      max-width:700px;
      margin:auto;
      background:white;
      border-radius:16px;
      overflow:hidden;
    ">

      <div style="
        background:#0d1b2a;
        color:white;
        padding:32px;
        text-align:center;
      ">
        <h1 style="margin:0;">
          Sponsorjobs Maandrapportage
        </h1>

        <p style="
          margin-top:12px;
          opacity:.8;
        ">
          ${data.club.name}
        </p>
      </div>

      <div style="padding:32px;">

        <h2>
          Resultaten van ${data.monthName}
        </h2>

        <table width="100%" cellpadding="12">
          <tr>
            <td align="center">
              <h2>${data.totalPageviewsLastMonth}</h2>
              <div>Paginaweergaven</div>
            </td>

            <td align="center">
              <h2>${data.totalClicksLastMonth}</h2>
              <div>Kliks</div>
            </td>
          </tr>

          <tr>
            <td align="center">
              <h2>${data.ctrLastMonth.toFixed(1)}%</h2>
              <div>CTR</div>
            </td>

            <td align="center">
              <h2>${data.totalSharesLastMonth}</h2>
              <div>Shares</div>
            </td>
          </tr>
        </table>

        <hr style="margin:30px 0;" />

        <h3>
          Groei ten opzichte van vorige maand
        </h3>

        <p>
          Klikgroei:
          <strong>${data.growth}%</strong>
        </p>

        <hr style="margin:30px 0;" />

        <h3>
          Meest bekeken sponsoren
        </h3>

        <ul>
          ${
            data.sponsors
              ?.slice(0, 3)
              ?.map(
                (s: any) =>
                  `<li>${s.sponsor} (${s.clicks} klikken)</li>`
              )
              .join("") || ""
          }
        </ul>

        <hr style="margin:30px 0;" />

        <h3>
          Best presterende vacatures
        </h3>

        <ul>
          ${
            data.topJobs
              ?.map(
                (job: any) =>
                  `<li>${job.title} (${job.clicks} klikken)</li>`
              )
              .join("") || ""
          }
        </ul>

        <hr style="margin:30px 0;" />

        <h3>
          Advies van Sponsorjobs
        </h3>

        <p>
          ${data.recommendation}
        </p>

        <div style="
          margin-top:40px;
          text-align:center;
        ">

          <a
            href="${dashboardUrl}"
            style="
              background:#0d1b2a;
              color:white;
              text-decoration:none;
              padding:14px 24px;
              border-radius:8px;
              display:inline-block;
            "
          >
            Bekijk dashboard
          </a>

        </div>

      </div>

    </div>

  </div>
  `;
}