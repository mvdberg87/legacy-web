import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { SUBSCRIPTIONS } from "@/lib/subscriptions";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET() {
  try {
    const now = new Date();

    const firstDayCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const firstDayLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const firstDayMonthBefore = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      1
    );

    /* ===============================
       1️⃣ Clubs ophalen
    =============================== */

    const { data: clubs } = await supabaseAdmin
      .from("clubs")
      .select(
        "id, name, slug, report_email, active_package, monthly_report_enabled"
      )
      .eq("monthly_report_enabled", true);

    for (const club of clubs ?? []) {
      if (!club.report_email) continue;

      /* ===============================
         2️⃣ Actieve vacatures
      =============================== */

      const { data: jobs } = await supabaseAdmin
        .from("jobs")
        .select("id, title, company_name")
        .eq("club_id", club.id)
        .is("archived_at", null);

      const jobIds = jobs?.map((j) => j.id) ?? [];
      if (jobIds.length === 0) continue;

      const jobMap = Object.fromEntries(
        jobs!.map((j) => [j.id, j])
      );

      /* ===============================
         3️⃣ Clicks vorige maand
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

      const totalClicksLastMonth =
        clicksLastMonth?.length ?? 0;

      const totalClicksMonthBefore =
        clicksMonthBefore?.length ?? 0;

      /* ===============================
         Pageviews vorige maand
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

      const totalPageviewsLastMonth =
        pageviewsLastMonth?.length ?? 0;

      const totalPageviewsMonthBefore =
        pageviewsMonthBefore?.length ?? 0;

      /* ===============================
         Click groei
      =============================== */

      let growth = 0;

      if (
        totalClicksMonthBefore === 0 &&
        totalClicksLastMonth > 0
      ) {
        growth = 100;
      } else if (totalClicksMonthBefore > 0) {
        growth = Math.round(
          ((totalClicksLastMonth -
            totalClicksMonthBefore) /
            totalClicksMonthBefore) *
            100
        );
      }

      /* ===============================
         CTR berekening
      =============================== */

      const ctrLastMonth =
        totalPageviewsLastMonth > 0
          ? (totalClicksLastMonth /
              totalPageviewsLastMonth) *
            100
          : 0;

      const ctrMonthBefore =
        totalPageviewsMonthBefore > 0
          ? (totalClicksMonthBefore /
              totalPageviewsMonthBefore) *
            100
          : 0;

      let ctrGrowth = 0;

      if (
        ctrMonthBefore === 0 &&
        ctrLastMonth > 0
      ) {
        ctrGrowth = 100;
      } else if (ctrMonthBefore > 0) {
        ctrGrowth = Math.round(
          ((ctrLastMonth - ctrMonthBefore) /
            ctrMonthBefore) *
            100
        );
      }

      /* ===============================
         4️⃣ Sponsor statistieken
      =============================== */

      const sponsorMap: Record<
        string,
        {
          vacancies: number;
          clicks: number;
          last_activity: string | null;
        }
      > = {};

      jobs?.forEach((job) => {
        if (!sponsorMap[job.company_name]) {
          sponsorMap[job.company_name] = {
            vacancies: 0,
            clicks: 0,
            last_activity: null,
          };
        }
        sponsorMap[job.company_name].vacancies++;
      });

      clicksLastMonth?.forEach((click) => {
        const job = jobMap[click.job_id];
        if (!job) return;

        const sponsor =
          sponsorMap[job.company_name];

        sponsor.clicks++;

        if (
          !sponsor.last_activity ||
          new Date(click.created_at) >
            new Date(sponsor.last_activity)
        ) {
          sponsor.last_activity =
            click.created_at;
        }
      });

      const sponsors = Object.entries(sponsorMap)
        .map(([name, data]) => ({
          sponsor: name,
          ...data,
        }))
        .sort((a, b) => b.clicks - a.clicks);

      /* ===============================
         5️⃣ Vacature statistieken
      =============================== */

      const jobStats = jobs?.map((job) => {
        const clicks =
          clicksLastMonth?.filter(
            (c) => c.job_id === job.id
          ).length ?? 0;

        return {
          title: job.title,
          company: job.company_name,
          clicks,
        };
      });

      const topJobs = jobStats
        ?.sort((a, b) => b.clicks - a.clicks)
        .slice(0, 3);

      const zeroClickJobs = jobStats?.filter(
        (j) => j.clicks === 0
      );

      /* ===============================
         6️⃣ Advertentiegebruik
      =============================== */

      const { count: adsCount } =
        await supabaseAdmin
          .from("jobs")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("club_id", club.id)
          .eq("featured", true)
          .is("archived_at", null);

      const maxAds =
        SUBSCRIPTIONS[club.active_package]?.ads ??
        0;

      const monthName =
        firstDayLastMonth.toLocaleDateString(
          "nl-NL",
          {
            month: "long",
            year: "numeric",
          }
        );

      /* ===============================
         7️⃣ Mail versturen
      =============================== */

      await resend.emails.send({
        from: "Sponsorjobs <no-reply@sponsorjobs.nl>",
        to: club.report_email,
        subject: `Maandrapport vacatures – ${monthName}`,
        html: generateHtml({
          club,
          monthName,
          totalCompanies: Object.keys(sponsorMap).length,
          totalVacancies: jobs?.length ?? 0,
          totalClicksLastMonth,
          totalPageviewsLastMonth,
          ctrLastMonth: ctrLastMonth.toFixed(1),
          ctrGrowth,
          growth,
          sponsors,
          topJobs,
          zeroClickJobs,
          adsCount: adsCount ?? 0,
          maxAds,
        }),
      });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("CRON ERROR:", err);
    return NextResponse.json(
      { error: "Cron failed" },
      { status: 500 }
    );
  }
}

/* ===============================
   HTML TEMPLATE
=============================== */

function generateHtml(data: any) {
  const navy = "#0d1b2a";
  const green = "#2f9e44";

  return `
  <div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:40px;">
    <div style="max-width:800px;margin:auto;background:white;padding:40px;border-radius:12px;">
      
      <h1 style="color:${navy}; margin-bottom:8px;">
        Maandrapport Vacatures
      </h1>
      <p style="color:#666;margin-bottom:30px;">
        ${data.monthName} – ${data.club.name}
      </p>

      <h2 style="color:${navy};">Overzicht</h2>
      <p><strong>Bedrijven actief:</strong> ${data.totalCompanies}</p>
      <p><strong>Vacatures actief:</strong> ${data.totalVacancies}</p>
      <p><strong>Pageviews afgelopen maand:</strong> ${data.totalPageviewsLastMonth}</p>
      <p><strong>Clicks afgelopen maand:</strong> ${data.totalClicksLastMonth}</p>
      <p><strong>Click-through rate:</strong> ${data.ctrLastMonth}%</p>
      <p><strong>CTR groei t.o.v vorige maand:</strong> ${data.ctrGrowth}%</p>
      <p><strong>Click groei t.o.v vorige maand:</strong> ${data.growth}%</p>

      <hr style="margin:30px 0;" />

      <h2 style="color:${navy};">Top 3 sponsoren</h2>
      <ul>
        ${data.sponsors
          .slice(0, 3)
          .map(
            (s: any) =>
              `<li>${s.sponsor} – ${s.clicks} clicks</li>`
          )
          .join("")}
      </ul>

      <h2 style="color:${navy};">Top 3 vacatures</h2>
      <ul>
        ${data.topJobs
          ?.map(
            (j: any) =>
              `<li>${j.title} (${j.company}) – ${j.clicks} clicks</li>`
          )
          .join("")}
      </ul>

      ${
        data.zeroClickJobs?.length
          ? `
      <h2 style="color:${navy};">Vacatures zonder clicks</h2>
      <ul>
        ${data.zeroClickJobs
          .map(
            (j: any) =>
              `<li>${j.title} (${j.company})</li>`
          )
          .join("")}
      </ul>
      `
          : ""
      }

      <hr style="margin:30px 0;" />

      <h2 style="color:${navy};">Advertentiegebruik</h2>
      <p>
        ${data.adsCount} / ${
    data.maxAds === Infinity
      ? "∞"
      : data.maxAds
  }
      </p>

      ${
        data.maxAds !== Infinity &&
        data.adsCount >= data.maxAds
          ? `<p style="color:${green};font-weight:bold;">
              Upgrade naar volgend pakket voor meer zichtbaarheid.
             </p>`
          : ""
      }

    </div>
  </div>
  `;
}