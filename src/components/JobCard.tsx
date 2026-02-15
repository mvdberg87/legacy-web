"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import getSupabaseBrowser from "@/lib/supabaseBrowser";
import {
  getCompanyLogo,
  getFaviconFallback,
} from "@/lib/companyLogo";

/* ---------- Types ---------- */

type Job = {
  id: string;
  title: string;
  sponsor_name: string;
  apply_url: string;

  company_website?: string | null;
  company_logo_url?: string | null;

  featured?: boolean;
  club_id: string;
};

/* ---------- Component ---------- */

export default function JobCard({ job }: { job: Job }) {
  const supabase = getSupabaseBrowser();

  /* ---------- Logo state ---------- */
  const [logoSrc, setLogoSrc] = useState(
    getCompanyLogo(job.company_website, job.company_logo_url)
  );

  /* ---------- Server-side logo cache trigger ---------- */
  useEffect(() => {
    if (!job.company_logo_url && job.company_website) {
      fetch("/api/jobs/cache-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: job.id,
          company_website: job.company_website,
        }),
      }).catch(() => {
        // silent fail — UI fallback blijft werken
      });
    }
  }, [job.company_logo_url, job.company_website, job.id]);

  /* ---------- Click tracking ---------- */
  async function trackClick() {
    try {
      await supabase.from("job_clicks").insert({
        job_id: job.id,
        source: "job_card",
      });
    } catch {
      // clicks mogen nooit UX blokkeren
    }
  }

  return (
    <a
      href={job.apply_url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackClick}
      className={`group block rounded-2xl border transition p-4
        ${
          job.featured
            ? "border-yellow-400 bg-yellow-50 shadow-lg scale-[1.02]"
            : "bg-white hover:shadow-lg"
        }`}
    >
      {/* ⭐ Featured badge */}
      {job.featured && (
        <span className="mb-2 inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-black">
          ⭐ Uitgelicht
        </span>
      )}

      <div className="flex items-center gap-3">
        <Image
          src={logoSrc}
          alt={job.sponsor_name}
          width={48}
          height={48}
          className="h-12 w-12 rounded-lg object-contain border bg-white"
          onError={() =>
            setLogoSrc(getFaviconFallback(job.company_website))
          }
        />

        <div className="min-w-0">
          <h3 className="text-base font-semibold truncate text-club-primary">
            {job.title}
          </h3>
          <p className="text-xs opacity-70 truncate">
            {job.sponsor_name}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <span className="text-sm font-medium text-blue-600 group-hover:underline">
          Lees meer →
        </span>
      </div>
    </a>
  );
}
