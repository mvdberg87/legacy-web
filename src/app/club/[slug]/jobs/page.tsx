"use client";

import ClubSupportBar from "@/components/ClubSupportBar";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { SUBSCRIPTIONS } from "@/lib/subscriptions";
import ClubNavbar from "@/components/club/ClubNavbar";
import Link from "next/link";

/* ===============================
   Types
=============================== */

type PackageKey = "basic" | "plus" | "pro" | "unlimited";

type Job = {
  id: string;
  title: string;
  company_name: string;
  apply_url: string;
  created_at: string;
  featured: boolean;
};

type JobWithStats = Job & {
  total_clicks: number;
  total_shares: number; // 👈 toevoegen
  last_click: string | null;
  ctr: number;
  share_rate: number; // 👈 toevoegen
};

type Club = {
  id: string;
  name: string;
  active_package: PackageKey;
  admin_override?: boolean;
};

/* ===============================
   Page
=============================== */

export default function ClubJobsPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const [club, setClub] = useState<Club | null>(null);
  const [jobs, setJobs] = useState<JobWithStats[]>([]);
  const [archivedJobs, setArchivedJobs] = useState<JobWithStats[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===============================
     Data ophalen
  =============================== */

  useEffect(() => {
    loadData();
  }, [showArchived]);

  async function loadData() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return setLoading(false);

    const { data: profile } = await supabase
      .from("profiles")
      .select("club_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile?.club_id) return setLoading(false);

    const { data: clubData } = await supabase
      .from("clubs")
      .select("id, name, active_package, admin_override")
      .eq("id", profile.club_id)
      .maybeSingle();

    if (!clubData) return setLoading(false);
    setClub(clubData);

    /* ===============================
   Pageviews ophalen
=============================== */

const { count: pageviews } = await supabase
  .from("club_page_views")
  .select("*", { count: "exact", head: true })
  .eq("club_id", clubData.id);

const totalPageviews = pageviews ?? 0;

    const query = supabase
      .from("jobs")
      .select("id, title, company_name, apply_url, created_at, featured")
      .eq("club_id", profile.club_id);

    if (showArchived) {
      query.not("archived_at", "is", null);
    } else {
      query.is("archived_at", null);
    }

    const { data: jobsData } = await query
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

      console.log("JOBS:", jobsData);

    const jobIds = (jobsData ?? []).map((j) => j.id);

// 🔥 eerst checken!
if (jobIds.length === 0) {
  setJobs([]);
  setArchivedJobs([]);
  setLoading(false);
  return;
}

// 🔥 clicks ophalen (GEFILTERD)
const { data: jobClicks } = await supabase
  .from("job_clicks")
  .select("job_id, created_at")
  .in("job_id", jobIds);

    const stats: Record<string, { total: number; last: string | null }> = {};

    // 👇 NIEUW: shares ophalen
const { data: jobShares } = await supabase
  .from("job_shares")
  .select("job_id, created_at")
  .in("job_id", jobIds);

// 👇 NIEUW: shares groeperen
const shareStats: Record<string, number> = {};

(jobShares ?? []).forEach((s) => {
  shareStats[s.job_id] = (shareStats[s.job_id] || 0) + 1;
});

    (jobClicks ?? []).forEach((c) => {
      if (!stats[c.job_id]) {
        stats[c.job_id] = { total: 0, last: c.created_at };
      }
      stats[c.job_id].total++;
      if (
        !stats[c.job_id].last ||
        new Date(c.created_at) > new Date(stats[c.job_id].last!)
      ) {
        stats[c.job_id].last = c.created_at;
      }
    });

    const mapped =
  (jobsData ?? []).map((j) => {
    const clicks = stats[j.id]?.total ?? 0;
    const shares = shareStats[j.id] ?? 0;

    const ctr =
      totalPageviews > 0
        ? Number(((clicks / totalPageviews) * 100).toFixed(1))
        : 0;

    const share_rate =
      totalPageviews > 0
        ? Number(((shares / totalPageviews) * 100).toFixed(1))
        : 0;

    return {
      ...j,
      total_clicks: clicks,
      total_shares: shares,
      last_click: stats[j.id]?.last ?? null,
      ctr,
      share_rate,
    };
  }) ?? [];

    if (showArchived) {
      setArchivedJobs(mapped);
    } else {
      setJobs(mapped);
    }

    setLoading(false);
  }

  /* ===============================
     Guards
  =============================== */

  if (loading) return <p className="p-6">Laden…</p>;
  if (!club) return <p className="p-6">Club niet gevonden</p>;

  const maxVacancies =
  SUBSCRIPTIONS[club.active_package].vacancies;

const currentVacancies = jobs.length;
const isLimitReached = currentVacancies >= maxVacancies;

  const canUseAds =
    club.admin_override || club.active_package !== "basic";

  const visibleJobs = showArchived ? archivedJobs : jobs;

  /* ===============================
     Acties
  =============================== */

  async function addJob(e: React.FormEvent) {
    e.preventDefault();
    if (!jobTitle || !companyName || !jobUrl) return;

    setIsSubmitting(true);

    await supabase.from("jobs").insert({
      club_id: club.id,
      title: jobTitle.trim(),
      company_name: companyName.trim(),
      apply_url: jobUrl.trim(),
      featured: false,
    });

    setJobTitle("");
    setCompanyName("");
    setJobUrl("");
    setIsSubmitting(false);
    loadData();
  }

  async function toggleFeatured(jobId: string) {
    const res = await fetch("/api/jobs/toggle-featured", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });

    if (res.status === 403) {
      const data = await res.json();

      if (data.reason === "limit_reached") {
        const goUpgrade = confirm(
          `Maximum aantal advertenties bereikt (${data.currentAds}/${data.maxAds}).\n\nKlik op OK om te upgraden.`
        );

        if (goUpgrade) {
          router.push(`/club/${slug}/billing`);
        }
        return;
      }
    }

    loadData();
  }

  async function archiveJob(jobId: string) {
    if (!confirm("Vacature archiveren?")) return;

    await supabase
      .from("jobs")
      .update({ archived_at: new Date().toISOString() })
      .eq("id", jobId);

    await supabase
      .from("club_ads")
      .update({ archived_at: new Date().toISOString(), is_active: false })
      .eq("job_id", jobId);

    loadData();
  }

  async function restoreJob(jobId: string) {
    await supabase
      .from("jobs")
      .update({ archived_at: null })
      .eq("id", jobId);

    loadData();
  }

  async function deleteJob(jobId: string) {
    if (!confirm("Vacature definitief verwijderen?")) return;

    await supabase.from("club_ads").delete().eq("job_id", jobId);
    await supabase.from("job_clicks").delete().eq("job_id", jobId);
    await supabase.from("jobs").delete().eq("id", jobId);

    loadData();
  }

  /* ===============================
     Render
  =============================== */

  return (
    <main className="min-h-screen p-6 bg-[#0d1b2a]">
      <ClubNavbar slug={slug} />

      <div className="max-w-5xl mx-auto bg-white border-2 rounded-2xl p-6 shadow mt-6">
        <h1 className="text-2xl font-semibold mb-4">Vacatures</h1>

        <div className="mb-4 text-sm">
  Vacatures:{" "}
  <strong>
    {currentVacancies} / {maxVacancies}
  </strong>

  {isLimitReached && (
    <span className="text-red-600 ml-2">
      ⚠️ Limiet bereikt
    </span>
  )}
</div>

        {!showArchived && (
          <form onSubmit={addJob} className="grid gap-3 mb-6">
            <input
              placeholder="Bedrijfsnaam"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="border-2 rounded-lg px-3 py-2"
              required
            />
            <input
              placeholder="Functietitel"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="border-2 rounded-lg px-3 py-2"
              required
            />
            <input
              placeholder="https://bedrijf.nl/vacature"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="border-2 rounded-lg px-3 py-2"
              required
            />
            <button
  disabled={isLimitReached}
  className={`rounded-xl py-3 font-semibold ${
    isLimitReached
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-green-600 text-white"
  }`}
>
  {isLimitReached
    ? "Limiet bereikt"
    : "Vacature toevoegen"}
</button>

{isLimitReached && (
  <div className="text-sm text-orange-600 mt-2">
    Upgrade je pakket om meer vacatures te plaatsen
  </div>
)}
          </form>
        )}

        <label className="flex items-center gap-2 text-sm mb-4">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />
          Toon alleen gearchiveerde vacatures
        </label>

        {/* MOBILE JOB CARDS */}
<div className="md:hidden space-y-4 mb-6">
  {visibleJobs.map((job) => (
    <div
  key={job.id}
  className={`border rounded-xl p-4 shadow-sm hover:shadow-md transition ${
    job.featured ? "border-yellow-400 bg-yellow-50" : ""
  }`}
>
      <div className="font-semibold text-lg">{job.title}</div>

      <div className="text-sm text-gray-500 mb-3">
  {job.company_name}
</div>

<div className="border-t border-gray-200 my-3"></div>

<div className="grid grid-cols-5 text-sm mb-4">

  <div>
    <div className="text-gray-400 text-xs">CTR</div>
    <div>{job.ctr}%</div>
  </div>

  <div>
    <div className="text-gray-400 text-xs">Clicks</div>
    <div>{job.total_clicks}</div>
  </div>

  {/* 👇 HIER TOEVOEGEN */}
  <div>
    <div className="text-gray-400 text-xs">Shares</div>
    <div>{job.total_shares ?? 0}</div>
  </div>

  <div>
    <div className="text-gray-400 text-xs">Share rate</div>
    <div>{job.share_rate}%</div>
  </div>

  <div>
    <div className="text-gray-400 text-xs">Laatste click</div>
    <div>
      {job.last_click
        ? new Date(job.last_click).toLocaleDateString("nl-NL")
        : "—"}
    </div>
  </div>

</div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">

        <Link
          href={`/club/${slug}/jobs/public`}
          target="_blank"
          className="flex-1 text-center border rounded-md py-2 text-sm"
        >
          Bekijk
        </Link>

        <button
          onClick={() =>
            router.push(`/club/${slug}/jobs/${job.id}/edit`)
          }
          className="flex-1 border rounded-md py-2 text-sm"
        >
          Bewerken
        </button>

        <button
          onClick={() => toggleFeatured(job.id)}
          disabled={!canUseAds}
          className={`flex-1 rounded-md py-2 text-sm border flex items-center justify-center gap-2
          ${
            job.featured
              ? "bg-yellow-100 border-yellow-400 text-yellow-800"
              : ""
          }`}
        >
          <span
            className={`w-3 h-3 rounded-full ${
              job.featured ? "bg-yellow-500" : "bg-gray-300"
            }`}
          />
          Advertentie
        </button>

        <details className="flex-1 relative">
          <summary className="border rounded-md py-2 text-sm text-center cursor-pointer">
            ⋯
          </summary>

          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">

            {!showArchived && (
              <button
                onClick={() => archiveJob(job.id)}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                Archiveren
              </button>
            )}

            <button
              onClick={() => deleteJob(job.id)}
              className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
            >
              Verwijderen
            </button>

          </div>
        </details>

      </div>
    </div>
  ))}
</div>

        <div className="border-4 border-[#0d1b2a] rounded-xl overflow-hidden">
  <table className="min-w-full text-sm">
          <thead className="bg-[#0d1b2a] text-white border-b-4 border-[#0d1b2a]">
            <tr>
  <th className="px-4 py-3 text-left">Item</th>
  <th className="px-4 py-3 text-center">CTR</th>
  <th className="px-4 py-3 text-center">Clicks</th>
  <th className="px-4 py-3 text-center">Shares</th>
  <th className="px-4 py-3 text-center">Share rate</th>
  <th className="px-4 py-3 text-center">Laatste click</th>
  <th className="px-4 py-3 text-center">Beheer</th>
</tr>
          </thead>
          <tbody className="[&>tr:nth-child(even)]:bg-gray-50/60">
  {visibleJobs.map((job) => (
              <tr
  key={job.id}
  className={`border-t border-[#0d1b2a] hover:bg-gray-100 transition ${
    job.featured
      ? "bg-yellow-50 border-l-4 border-yellow-400"
      : ""
  }`}
>
                <td className="px-4 py-3">
                  <div className="font-medium">{job.title}</div>
                  <div className="text-xs text-gray-500">
                    {job.company_name}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
  {job.ctr} %
</td>
<td className="px-4 py-3 text-center">
  {job.total_clicks}
</td>
<td className="px-4 py-3 text-center">
  {job.total_shares ?? 0}
</td>

<td className="px-4 py-3 text-center">
  {job.share_rate} %
</td>
                <td className="px-4 py-3 text-center">
                  {job.last_click
                    ? new Date(job.last_click).toLocaleDateString("nl-NL")
                    : "—"}
                </td>
                <td className="px-4 py-3">
  <div className="flex flex-wrap items-center justify-center gap-2">

    {/* Bekijk */}
    <Link
      href={`/club/${slug}/jobs/public`}
      target="_blank"
      className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
    >
      Bekijk
    </Link>

    {/* Bewerken */}
    <button
      onClick={() =>
        router.push(`/club/${slug}/jobs/${job.id}/edit`)
      }
      className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
    >
      Bewerken
    </button>

    {/* Advertentie toggle */}
    <button
      onClick={() => toggleFeatured(job.id)}
      disabled={!canUseAds}
      className={`px-3 py-1 text-sm rounded-md border flex items-center gap-2
        ${job.featured
          ? "bg-yellow-100 border-yellow-400 text-yellow-800"
          : "hover:bg-gray-50"}
      `}
    >
      <span className={`w-3 h-3 rounded-full ${job.featured ? "bg-yellow-500" : "bg-gray-300"}`} />
      Advertentie
    </button>

    {/* Dropdown menu */}
    <details className="relative">
      <summary className="px-3 py-1 text-sm border rounded-md cursor-pointer hover:bg-gray-50">
        ⋯
      </summary>

      <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">

        {!showArchived && (
          <button
            onClick={() => archiveJob(job.id)}
            className="block w-full text-left px-3 py-2 hover:bg-gray-100"
          >
            Archiveren
          </button>
        )}

        <button
          onClick={() => deleteJob(job.id)}
          className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
        >
          Verwijderen
        </button>

      </div>
    </details>

  </div>
</td>
</tr>
))}
</tbody>
</table>
</div>

{/* ===============================
    Support balk
=============================== */}
<ClubSupportBar />

</div>
</main>

  );
}