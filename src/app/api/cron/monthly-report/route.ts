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

if (clubsError) {
  throw clubsError;
}

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
   Advertisement Stats
=============================== */

let advertisementRevenue = 0;
let advertisementsSold = 0;

if (club.advertising_sales_enabled) {

  const { data: advertisements } =
    await supabaseAdmin
      .from("company_advertisements")
      .select(`
        club_amount,
        created_at
      `)
      .eq("club_id", club.id)
      .gte(
        "created_at",
        firstDayLastMonth.toISOString()
      )
      .lt(
        "created_at",
        firstDayCurrentMonth.toISOString()
      );

  advertisementsSold =
    advertisements?.length ?? 0;

  advertisementRevenue =
    advertisements?.reduce(
      (sum, ad) =>
        sum + (ad.club_amount ?? 0),
      0
    ) ?? 0;
}

/* ===============================
   Sponsorjobs Score
=============================== */

let sponsorjobsScore = 0;

/* CTR (30 punten) */
sponsorjobsScore += Math.min(
  30,
  Math.round(ctrLastMonth * 6)
);

/* Groei (20 punten) */
sponsorjobsScore += Math.min(
  20,
  Math.max(0, Math.round(growth / 5))
);

/* Werkgevers (20 punten) */

const activeEmployers = sponsors.length;

sponsorjobsScore += Math.min(
  20,
  activeEmployers * 2
);

/* Vacatures met klikken (20 punten) */
const jobsWithClicks =
  jobStats.filter(j => j.clicks > 0).length;

const clickCoverage =
  jobs.length > 0
    ? jobsWithClicks / jobs.length
    : 0;

sponsorjobsScore += Math.round(
  clickCoverage * 20
);

/* Managed Ads (10 punten) */

if (club.advertising_sales_enabled) {

  sponsorjobsScore += Math.min(
    10,
    advertisementsSold * 2
  );

} else {

  sponsorjobsScore += 10;

}

sponsorjobsScore = Math.min(
  100,
  sponsorjobsScore
);

let scoreLabel = "";
let scoreColor = "";

if (sponsorjobsScore >= 90) {

  scoreLabel = "Uitstekend";
  scoreColor = "#27ae60";

} else if (sponsorjobsScore >= 75) {

  scoreLabel = "Sterk";
  scoreColor = "#3498db";

} else if (sponsorjobsScore >= 60) {

  scoreLabel = "Goed op weg";
  scoreColor = "#f39c12";

} else if (sponsorjobsScore >= 40) {

  scoreLabel = "Er liggen kansen";
  scoreColor = "#e67e22";

} else {

  scoreLabel = "Tijd voor actie";
  scoreColor = "#e74c3c";

}


      /* ===============================
         Recommendation
      =============================== */

      let recommendation = "";

if (zeroClickJobs.length > 0) {

recommendation =
`Er staan ${zeroClickJobs.length} vacatures zonder klikken. Deel deze vacatures via Instagram, LinkedIn of WhatsApp en vraag de sponsor hetzelfde te doen.`;

}

else if (ctrLastMonth < 2) {

recommendation =
"Jullie CTR ligt nog onder het gemiddelde. Gebruik aantrekkelijkere functietitels en deel vacatures vaker via jullie communicatiekanalen.";

}

else if (
club.advertising_sales_enabled &&
advertisementsSold === 0
) {

recommendation =
"Deze maand zijn er geen nieuwe advertenties verkocht. Benader bestaande sponsoren voor een extra zichtbaarheidscampagne.";

}

else {

  recommendation =
    "Sterke maand! Richt je volgende maand op meer actieve werkgevers zodat het aanbod verder groeit.";

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
  sponsorjobsScore,
scoreLabel,
scoreColor,

  sponsors,
  topJobs,
  recommendation,

  advertisementRevenue,
  advertisementsSold,

  advertisingSalesEnabled:
    club.advertising_sales_enabled,

  activeJobs: jobs.length,

  totalSponsors: sponsors.length,

  zeroClickJobs: zeroClickJobs.length,

  maxAds,
}),
      });

      if (mailError) {
        console.error(mailError);

        const { error: reportError } =
  await supabaseAdmin
    .from("monthly_reports")
    .insert({
      club_id: club.id,
      month: monthKey,
      status: "failed",
    });

if (reportError) {
  console.error(
    "MONTHLY REPORT INSERT FAILED:",
    reportError
  );
}

        continue;
      }

      const { error: reportError } =
  await supabaseAdmin
    .from("monthly_reports")
    .insert({
      club_id: club.id,
      month: monthKey,

      total_clicks: totalClicksLastMonth,
      total_pageviews: totalPageviewsLastMonth,
      total_shares: totalSharesLastMonth,

      ctr: Number(
        ctrLastMonth.toFixed(1)
      ),

      share_rate: Number(
        shareRate.toFixed(1)
      ),

      growth,

      advertisements_sold:
        advertisementsSold,

      advertisement_revenue:
        advertisementRevenue,

      status: "sent",

      sent_at: new Date(),
    });

if (reportError) {
  console.error(
    "MONTHLY REPORT INSERT FAILED:",
    reportError
  );
}
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

        <h2 style="
margin-bottom:6px;
">
Resultaten van ${data.monthName}
</h2>

<p style="
color:#666;
margin-top:0;
margin-bottom:30px;
">
Bekijk hoe Sponsorjobs deze maand heeft
gepresteerd.
</p>

<div style="
background:#f4f7fb;
border-radius:12px;
padding:24px;
text-align:center;
margin-bottom:30px;
">

<div style="
font-size:14px;
color:#666;
margin-bottom:8px;
">
Sponsorjobs Score
</div>

<div style="
font-size:48px;
font-weight:bold;
color:#0d1b2a;
">
${data.sponsorjobsScore}
</div>

<div
style="
font-size:18px;
font-weight:bold;
color:${data.scoreColor};
">

${data.scoreLabel}

</div>

<div style="
background:#e5e7eb;
height:8px;
border-radius:8px;
overflow:hidden;
margin-top:18px;
">

<div style="
width:${data.sponsorjobsScore}%;
height:100%;
background:${data.scoreColor};
">
</div>

</div>

</div>

<div style="
display:grid;
grid-template-columns:repeat(2,1fr);
gap:16px;
margin-bottom:40px;
">

<div style="
background:#fafafa;
padding:20px;
border-radius:10px;
text-align:center;
">

<div style="font-size:28px;">
👀
</div>

<h2>${data.totalPageviewsLastMonth}</h2>

Paginaweergaven

</div>

<div style="
background:#fafafa;
padding:20px;
border-radius:10px;
text-align:center;
">

<div style="font-size:28px;">
🎯
</div>

<h2>${data.totalClicksLastMonth}</h2>

Vacatureklikken

</div>

<div style="
background:#fafafa;
padding:20px;
border-radius:10px;
text-align:center;
">

<div style="font-size:28px;">
📤
</div>

<h2>${data.totalSharesLastMonth}</h2>

Gedeeld

</div>

<div style="
background:#fafafa;
padding:20px;
border-radius:10px;
text-align:center;
">

<div style="font-size:28px;">
🏢
</div>

<h2>${data.totalSponsors}</h2>

Werkgevers

</div>

</div>

        <div style="
background:#f8fafc;
padding:24px;
border-radius:12px;
margin:30px 0;
">

<h3 style="margin-top:0;">
Groei deze maand
</h3>

<div style="
display:flex;
justify-content:space-between;
margin-top:20px;
">

<div style="text-align:center;flex:1;">
<div style="font-size:32px;font-weight:bold;color:#0d1b2a;">
${data.growth}%
</div>
<div>Klikgroei</div>
</div>

<div style="text-align:center;flex:1;">
<div style="font-size:32px;font-weight:bold;color:#0d1b2a;">
${data.ctrLastMonth.toFixed(1)}%
</div>
<div>CTR</div>
</div>

<div style="text-align:center;flex:1;">
<div style="font-size:32px;font-weight:bold;color:#0d1b2a;">
${data.totalPageviewsLastMonth}
</div>
<div>Bezoekers</div>
</div>

</div>

</div>

        <div style="
background:#fff8e8;
padding:24px;
border-radius:12px;
margin:30px 0;
">

<h3 style="margin-top:0;">
🏆 Sponsor van de maand
</h3>

<h2 style="margin-bottom:5px;">
${data.sponsors[0]?.sponsor ?? "-"}
</h2>

<p style="margin:0;color:#666;">
${data.sponsors[0]?.clicks ?? 0} geïnteresseerden
</p>

</div>

        <div style="
background:#eef7ff;
padding:24px;
border-radius:12px;
margin:30px 0;
">

<h3 style="margin-top:0;">
💼 Vacature van de maand
</h3>

<h2 style="margin-bottom:5px;">
${data.topJobs[0]?.title ?? "-"}
</h2>

<p style="margin:0;color:#666;">
${data.topJobs[0]?.company ?? ""}
</p>

<p style="margin-top:10px;">
🎯 ${data.topJobs[0]?.clicks ?? 0} klikken
</p>

</div>

${
data.advertisingSalesEnabled
? `
<div style="
background:#fff4e6;
padding:24px;
border-radius:12px;
margin:30px 0;
">

<h3 style="margin-top:0;">
💰 Managed Ads
</h3>

<p>
Nieuwe advertenties:
<strong>${data.advertisementsSold}</strong>
</p>

<p>
Extra opbrengst:
<strong>
€${data.advertisementRevenue.toLocaleString("nl-NL")}
</strong>
</p>

</div>
`
: ""
}

        <div style="
background:#f3fdf5;
padding:24px;
border-radius:12px;
margin:30px 0;
">

<h3 style="margin-top:0;">
🧠 Coach van de maand
</h3>

<p style="
font-size:16px;
line-height:1.7;
margin-bottom:0;
">

${data.recommendation}

</p>

</div>

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