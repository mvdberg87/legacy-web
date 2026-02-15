"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
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
  last_click: string | null;
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

    const jobIds = (jobsData ?? []).map((j) => j.id);

    const { data: jobClicks } = await supabase
      .from("job_clicks")
      .select("job_id, created_at")
      .in("job_id", jobIds);

    const stats: Record<string, { total: number; last: string | null }> = {};

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
      (jobsData ?? []).map((j) => ({
        ...j,
        total_clicks: stats[j.id]?.total ?? 0,
        last_click: stats[j.id]?.last ?? null,
      })) ?? [];

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
            <button className="bg-green-600 text-white rounded-xl py-3 font-semibold">
              Vacature toevoegen
            </button>
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

        <table className="min-w-full text-sm border-2 rounded-xl overflow-hidden">
          <thead className="bg-[#0d1b2a] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Item</th>
              <th className="px-4 py-3 text-center">Clicks</th>
              <th className="px-4 py-3 text-center">Laatste click</th>
              <th className="px-4 py-3 text-center">Beheer</th>
            </tr>
          </thead>
          <tbody>
            {visibleJobs.map((job) => (
              <tr
  key={job.id}
  className={`border-t ${
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
                  {job.total_clicks}
                </td>
                <td className="px-4 py-3 text-center">
                  {job.last_click
                    ? new Date(job.last_click).toLocaleDateString("nl-NL")
                    : "—"}
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  {!showArchived ? (
                    <>
                      <Link
                        href={`/club/${slug}/jobs/public`}
                        target="_blank"
                        className="border px-2 py-1 rounded"
                      >
                        Bekijk
                      </Link>
                      <button
                        onClick={() =>
                          router.push(
                            `/club/${slug}/jobs/${job.id}/edit`
                          )
                        }
                        className="border px-2 py-1 rounded"
                      >
                        Bewerken
                      </button>
                      <button
  onClick={() => toggleFeatured(job.id)}
  disabled={!canUseAds}
  className={`border px-2 py-1 rounded ${
    job.featured
      ? "bg-yellow-200 border-yellow-500 font-semibold"
      : "hover:bg-gray-100"
  }`}
>
  {job.featured ? "Advertentie ✓" : "Advertentie"}
</button>
                      <button
                        onClick={() => archiveJob(job.id)}
                        className="border px-2 py-1 rounded text-yellow-600"
                      >
                        Archiveren
                      </button>
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="border px-2 py-1 rounded text-red-600"
                      >
                        Verwijderen
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => restoreJob(job.id)}
                        className="border px-2 py-1 rounded text-green-700"
                      >
                        Herstellen
                      </button>
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="border px-2 py-1 rounded text-red-600"
                      >
                        Verwijderen
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
