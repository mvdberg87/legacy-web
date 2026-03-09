"use client";

import ListingCard from "@/components/ListingCard";
import { useEffect, useState, useMemo } from "react";
import { getCompanyLogo } from "@/lib/companyLogo";

/* ---------- Types ---------- */

type Club = {
  id: string;
  name: string;
  slug: string;
  primary_color?: string | null;
  secondary_color?: string | null;
};

type Job = {
  id: string;
  job_title: string;
  company_name: string;
  created_at: string;
  apply_url: string | null;
  is_featured?: boolean;
  company_website?: string | null;
  company_logo_url?: string | null;
};

type Ad = {
  id: string;
  job_title?: string;
  company_name: string;
  link_url: string;
  image_url?: string | null;
  is_featured: boolean;
};

type Props = {
  club: Club;
  introText: string;
  jobs: Job[];
  ads: Ad[];
  adminEmail?: string | null;
};

/* ---------- Component ---------- */

export default function ClientPage({
  club,
  introText,
  jobs,
  ads,
  adminEmail,
}: Props) {

    /* ===============================
     Pageview tracking
  =============================== */
  useEffect(() => {
  if (!club?.id) return;

  fetch("/api/track-pageviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clubId: club.id,
    }),
    keepalive: true,   // 🔥 BELANGRIJK
  }).catch(() => {});
}, []);
  
  function trackJobClick(jobId: string) {
  if (!club?.id) return;

  fetch("/api/jobs/track-click", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      job_id: jobId,
      club_id: club.id,
      source: "public_jobs_page",
    }),
    keepalive: true,   // 🔥 zorgt dat request niet wordt afgebroken bij navigatie
  }).catch(() => {});
}

  const [companyFilter, setCompanyFilter] = useState<string | null>(null);

const filteredJobs = companyFilter
  ? jobs.filter((job) => job.company_name === companyFilter)
  : jobs;

const sortedJobs = useMemo(() => {

  const todaySeed = new Date().toISOString().slice(0, 10);

  function seededRandom(seed: string) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
    }
    return () => {
      h = Math.imul(1664525, h) + 1013904223;
      return ((h >>> 0) % 1000) / 1000;
    };
  }

  const random = seededRandom(todaySeed);

  return [...filteredJobs]
    .filter((job) => !job.is_featured)
    .sort(() => random() - 0.5);

}, [filteredJobs]);

const bestJob = sortedJobs.length > 0 ? sortedJobs[0] : null;

  /* ===============================
   Bedrijven met vacatures
================================ */

const companies = Array.from(
  new Map(
    [

      
      ...jobs.map((job) => ({
        name: job.company_name,
        logo: job.company_logo_url,
        website: job.company_website || job.apply_url,
      })),
      ...ads.map((ad) => ({
        name: ad.company_name,
        logo: ad.image_url,
        website: ad.link_url,
      })),
    ].map((company) => [company.name, company])
  ).values()
);

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "#0d1b2a" }}
    >
      {/* Header */}
      <div className="h-28 flex flex-col justify-center items-center text-center shadow bg-white">
        <h1 className="text-2xl sm:text-3xl font-semibold">
  Vacatures bij sponsoren van {club.name}
</h1>
<p className="text-sm text-gray-600">
  Leden, supporters en bedrijven verbinden
</p>
      </div>

      <div
        className="
          max-w-4xl mx-auto
          bg-[#0d1b2a]
          border-2 border-white
          rounded-2xl
          p-8
          shadow
          mt-8
          text-white
        "
      >

        {/* =========================
            INTROTEKST
        ========================== */}
        <section className="mb-10 rounded-2xl bg-[#0d1b2a] p-6 text-white leading-relaxed whitespace-pre-line">
          {introText}
        </section>

        {/* =========================
    BEDRIJVEN MET VACATURES
========================= */}

{companies.length > 0 && (
  <section className="mb-12">
    <h2 className="text-lg font-semibold mb-4 text-white text-center">
      Werken bij onze sponsoren
    </h2>

    <div className="overflow-hidden py-4 px-6">
      <div className="flex gap-8 animate-scroll w-max">

        {[...companies, ...companies].map((company, index) => {

  const website = company.website ?? jobs.find(j => j.company_name === company.name)?.apply_url;

const logo = getCompanyLogo(website, company.logo);

          return (
            <div
  key={company.name + index}
  onClick={() => setCompanyFilter(company.name)}
  className="
    flex items-center justify-center
    bg-white rounded-xl px-6 py-3
    min-w-[140px]
    cursor-pointer
    hover:scale-105
    transition
  "
>
              {logo ? (
  <img
  src={logo}
  alt={company.name}
  className="h-10 object-contain"
  onError={(e) => {
  try {
    const domain = website
      ? new URL(website.startsWith("http") ? website : `https://${website}`).hostname
      : null;

    (e.currentTarget as HTMLImageElement).src = domain
      ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
      : "/placeholder-logo.svg";
  } catch {
    (e.currentTarget as HTMLImageElement).src = "/placeholder-logo.svg";
  }
}}
/>
) : (
  <img
    src={`https://www.google.com/s2/favicons?domain=${company.name}&sz=128`}
    alt={company.name}
    className="h-10 object-contain opacity-70"
  />
)}
            </div>
          );
        })}

      </div>
    </div>

  </section>
)}

        {/* =========================
            SPONSOREN (ADS)
        ========================== */}
        {ads.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Uitgelichte kansen
            </h2>

            <div className="grid gap-4">
              {ads.map((ad) => {
                const jobId = ad.id.startsWith("job-")
                  ? ad.id.replace("job-", "")
                  : null;

                return (
                  <div
                    key={ad.id}
                    onClick={async () => {
                      if (jobId) await trackJobClick(jobId);
                    }}
                    className="
                      rounded-2xl
                      border-2 border-white
                      transition-all duration-200
                      bg-[#e6dfc8]        /* 🟡 Goud */
                      hover:bg-white
                      hover:shadow-lg
                    "
                  >
                    <ListingCard
  href={ad.link_url}
  external
  title={ad.job_title ?? "Sponsor"}
  company={ad.company_name}
  website={ad.link_url}
  cachedLogo={ad.image_url}
  variant="ad"   // 👈 NIEUW
/>
                  </div>
                );
              })}
            </div>
          </section>
        )}

{/* =========================
    OVERGANG
========================== */}
<div className="my-12 border-t border-white/20"></div>

<section className="mb-12 text-center text-sm text-white/60">
  <p>
    Hieronder vind je alle actuele vacatures binnen het netwerk van {club.name}.
  </p>
</section> 

        {/* =========================
            VACATURES
        ========================== */}
        {sortedJobs.length === 0 ? (
          <p className="text-gray-300 italic text-center">
            Geen vacatures beschikbaar.
          </p>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-4">
  <h2 className="text-lg font-semibold text-white">
    Vacatures
  </h2>

  {companyFilter && (
    <button
      onClick={() => setCompanyFilter(null)}
      className="text-sm text-blue-300 underline"
    >
      Toon alle vacatures
    </button>
  )}
</div>

            <div className="grid gap-4">
              {sortedJobs.map((job) => {
  const isBest = bestJob && job.id === bestJob.id;

  return (
    <div
      key={job.id}
      className="relative"
      onClick={async () => {
        await trackJobClick(job.id);
      }}
    >

      {isBest && (
        <div className="absolute -top-2 -left-2 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
  Meest bekeken
</div>
      )}

      <ListingCard
        href={job.apply_url ?? "#"}
        external
        title={job.job_title}
        company={job.company_name}
        website={job.company_website || job.apply_url}
        cachedLogo={job.company_logo_url}
      />
    </div>
  );
})}
            </div>
          </section>
        )}
<footer className="text-center text-sm text-white mt-12 opacity-80">
  <p className="mb-2 font-medium">
    Heb je vragen over SponsorJobs? Of wil je als bedrijf ook toegang tot regionaal talent?
  </p>
  {adminEmail ? (
    <a
      href={`mailto:${adminEmail}`}
      className="underline text-blue-300"
    >
      Neem gerust contact op via {adminEmail}
    </a>
  ) : (
    <p>Neem gerust contact op met het clubbestuur.</p>
  )}
</footer>
      </div>
    </main>
  );
}
