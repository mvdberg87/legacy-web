"use client";

import ListingCard from "@/components/ListingCard";

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
};

/* ---------- Component ---------- */

export default function ClientPage({
  club,
  introText,
  jobs,
  ads,
}: Props) {
  async function trackJobClick(jobId: string) {
    try {
      await fetch("/api/jobs/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: jobId,
          club_id: club.id,
          source: "public_jobs_page",
        }),
      });
    } catch (err) {
      console.error("track click failed", err);
    }
  }

  const sortedJobs = [...jobs].sort(
    (a, b) => Number(b.is_featured) - Number(a.is_featured)
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
            <h2 className="text-lg font-semibold mb-4 text-white">
              Vacatures
            </h2>

            <div className="grid gap-4">
              {sortedJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={async () => {
                    await trackJobClick(job.id);
                  }}
                >
                  <ListingCard
                    href={job.apply_url ?? "#"}
                    external
                    title={job.job_title}
                    company={job.company_name}
                    website={job.company_website}
                    cachedLogo={job.company_logo_url}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-gray-400 mt-12">
          Powered by{" "}
          <a
            href="https://sponsorjobs.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            <title>Sponsorjobs</title>
          </a>
        </footer>
      </div>
    </main>
  );
}
