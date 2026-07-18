"use client";

import ListingCard from "@/components/ListingCard";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getCompanyLogo } from "@/lib/companyLogo";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/EmptyState";
import TalentpoolModal from "@/components/talentpool/TalentpoolModal";
/* ---------- Types ---------- */

type Club = {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;

  advertising_sales_enabled?: boolean | null;
  talentpool_enabled?: boolean | null;
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
  total_clicks?: number;
  source?: "job" | "advertisement";
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
  ctaTitle?: string;
ctaText?: string;
  jobs: Job[];
  ads: Ad[];
  adminEmail?: string | null;
};

/* ---------- Component ---------- */

export default function ClientPage({
  club,
  introText,
  ctaTitle,
  ctaText,
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

  console.log("JOB CLICK", jobId);

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
    keepalive: true,
  }).catch(() => {});
}

/* ===============================
   TeamApp share tracking
=============================== */

function trackJobShare(jobId: string) {
  if (!club?.id) return;

  console.log("JOB SHARE", jobId);

  fetch("/api/jobs/track-share", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      job_id: jobId,
      club_id: club.id,
      source: "public_jobs_page",
    }),
    keepalive: true,
  }).catch(() => {});
}

function trackAdvertisementClick(
  advertisementId: string
) {
  if (!club?.id) return;

  console.log(
  "ADVERTISEMENT CLICK",
  advertisementId
);

  fetch(
    "/api/advertisements/track-click",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        advertisement_id:
          advertisementId,
        club_id: club.id,
        source:
          "public_jobs_page",
      }),
      keepalive: true,
    }
  ).catch(() => {});
}

function trackAdvertisementShare(
  advertisementId: string
) {
  if (!club?.id) return;

  console.log("ADVERTISEMENT SHARE", advertisementId);

  fetch(
    "/api/advertisements/track-share",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        advertisement_id:
          advertisementId,
        club_id: club.id,
        source:
          "public_jobs_page",
      }),
      keepalive: true,
    }
  ).catch(() => {});
}

  const searchParams = useSearchParams();
const companyParam = searchParams.get("company");

const [companyFilter, setCompanyFilter] = useState<string | null>(companyParam);

const [showTalentpoolModal, setShowTalentpoolModal] =
  useState(false);

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

const bestJob = useMemo(() => {
  if (!jobs.length) return null;

  return [...jobs].sort((a, b) => {
    return (b.total_clicks ?? 0) - (a.total_clicks ?? 0);
  })[0];
}, [jobs]);

/* ===============================
   NIEUWE VACATURE CHECK
================================ */

function isNewJob(date: string) {
  const created = new Date(date);
  const now = new Date();

  const diffDays =
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);

  return diffDays <= 7;
}

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
    ].map((company) => [
      company.name.trim().toLowerCase(),
      company,
    ])
  ).values()
);

const ctaButtonClass =
  "inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white w-full sm:w-auto";

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "#0d1b2a" }}
    >
      {/* Header */}
{/* Header */}
<div className="py-6 sm:py-8 px-4 flex flex-col items-center text-center shadow bg-white">

  {club.logo_url && (
    <img
      src={club.logo_url}
      alt={`${club.name} logo`}
      className="h-32 w-32 object-contain mb-4"
    />
  )}

  <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
    Vacatures bij sponsoren van
  </h1>

  <h2
  className="text-xl sm:text-2xl md:text-3xl font-bold mt-2"
  style={{ color: club.primary_color ?? "#000" }}
>
  {club.name}
</h2>

  <p className="text-sm sm:text-base text-gray-600 mt-4">
    Leden, supporters en bedrijven verbinden
  </p>

</div>

<div
  className="
    max-w-4xl mx-auto p-4 sm:p-8
    bg-[#0d1b2a]
    border-2 border-white
    rounded-2xl
    shadow
    mt-8
    text-white
  "
>
        {/* =========================
            INTROTEKST
        ========================== */}
        <section className="mb-8 sm:mb-10 rounded-2xl bg-[#0d1b2a] p-5 sm:p-8 text-white leading-relaxed whitespace-pre-line text-center max-w-2xl mx-auto text-sm sm:text-base">
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

    <div className="overflow-hidden py-4 px-2 sm:px-6">
      <div className="flex gap-8 animate-scroll w-max">

        {[...companies, ...companies, ...companies].map((company, index) => {

  const website = company.website ?? jobs.find(j => j.company_name === company.name)?.apply_url;

const logo = getCompanyLogo(website, company.logo);

          return (
            <div
  key={company.name + index}
  onClick={() => {
    if (website) {
      window.open(website, "_blank");
    }
  }}
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

            <div className="grid gap-3 sm:gap-4">
              {ads.map((ad) => {

  const jobId = ad.id.startsWith("job-")
    ? ad.id.replace("job-", "")
    : ad.id;

    const isMarketplaceAd =
  !ad.id.startsWith("job-");


                return (
                  <ListingCard
  href={ad.link_url}
  external
  title={ad.job_title ?? "Vacature bekijken"}
  company={ad.company_name}
  website={ad.link_url}
  cachedLogo={ad.image_url}
  jobId={jobId}
  clubId={club.id}
  variant="ad"
  onClick={() => {

    if (isMarketplaceAd) {
      trackAdvertisementClick(ad.id);
    } else {
      trackJobClick(jobId);
    }

  }}
  onShare={() => {

    if (isMarketplaceAd) {
      trackAdvertisementShare(ad.id);
    } else {
      trackJobShare(jobId);
    }

  }}
/>
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
            <EmptyState
  title="Geen vacatures beschikbaar"
  description="Er zijn momenteel geen vacatures geplaatst."
/>
          </p>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-2 sm:mb-4">
  <h2 className="text-base sm:text-lg font-semibold text-white">
    Vacatures
  </h2>

  {companyFilter && (
    <Button
  variant="link"
  onClick={() => {
    window.location.href = `/${club.slug}`;
  }}
>
  Toon alle vacatures
</Button>
  )}
</div>

{/* 👇 NIEUW */}
<p className="text-xs sm:text-sm text-white/60 mb-3">
  Klik op een vacature om direct te solliciteren
</p>

{/* 👇 iets compacter op mobiel */}
<div className="grid gap-3 sm:gap-4">
              {sortedJobs.map((job) => {
  const isBest = bestJob && job.id === bestJob.id;

  return (
    <div key={job.id} className="relative">

      {isBest && (
        <div className="absolute -top-2 -left-2 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
          Meest bekeken
        </div>
      )}

      {!isBest && isNewJob(job.created_at) && (
        <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
          Nieuw
        </div>
      )}

      <ListingCard
        href={job.apply_url ?? "#"}
        external
        title={job.job_title}
        company={job.company_name}
        website={job.company_website || job.apply_url}
        cachedLogo={job.company_logo_url}
        jobId={job.id}
        clubId={club.id}
        onClick={() => {

  if (job.source === "advertisement") {
    trackAdvertisementClick(job.id);
  } else {
    trackJobClick(job.id);
  }

}}

onShare={() => {

  if (job.source === "advertisement") {
    trackAdvertisementShare(job.id);
  } else {
    trackJobShare(job.id);
  }

}}
      />
    </div>
  );
})}
            </div>
          </section>
        )}
<section
  className="
    mt-12
    bg-white
    rounded-2xl
    p-6 sm:p-8
    text-center
    shadow-lg
  "
>
  <h3 className="text-xl font-bold text-gray-900 mb-6">
    Ontdek de mogelijkheden
  </h3>

  <div className="flex flex-col gap-4 items-center">

    {club.talentpool_enabled && (
      <a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    setShowTalentpoolModal(true);
  }}
  className={ctaButtonClass}
  style={{
    backgroundColor: club.primary_color ?? "#1d4ed8",
  }}
>
  Ik zoek werk
</a>
    )}

    {club.advertising_sales_enabled ? (
  <a
    href="https://www.sponsorjobs.nl/bedrijven"
    target="_blank"
    rel="noopener noreferrer"
    className={ctaButtonClass}
    style={{
      backgroundColor: club.primary_color ?? "#1d4ed8",
    }}
  >
    Ik wil vacatures plaatsen
  </a>
) : (
      adminEmail && (
        <a
  href={`mailto:${adminEmail}`}
  className={ctaButtonClass}
  style={{
    backgroundColor: club.primary_color ?? "#1d4ed8",
  }}
>
  🏢 Ik wil vacatures plaatsen
</a>
      )
    )}

  </div>
</section>
      </div>
      <TalentpoolModal
  open={showTalentpoolModal}
  onClose={() => setShowTalentpoolModal(false)}
  club={club}
/>
    </main>
  );
}
