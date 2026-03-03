"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

/* ---------- Types ---------- */

type Job = {
  id: string;
  title: string;
  company_name: string;
  created_at: string;
  featured: boolean;
  archived_at?: string | null;
};

type JobWithStats = Job & {
  total_clicks: number;
  last_click: string | null;
};

type Club = {
  id: string;
  name: string;
  slug: string;
  active_package: string;
  primary_color?: string | null;
};

/* ---------- Pagina ---------- */

export default function AdminClubDetailPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  console.log("ADMIN SLUG:", slug);

  const [club, setClub] = useState<Club | null>(null);
  const [jobs, setJobs] = useState<JobWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [clubUser, setClubUser] = useState<any>(null);
const [newEmail, setNewEmail] = useState("");
const [stats, setStats] = useState({
  totalVacancies: 0,
  totalClicks: 0,
  monthClicks: 0,
  featuredCount: 0,
});

  /* ---------- Data ophalen ---------- */

  async function load() {
    setLoading(true);

    const { data: clubData } = await supabase
      .from("clubs")
      .select("id, name, slug, active_package, primary_color")
      .eq("slug", slug)
      .maybeSingle();

    if (!clubData) {
  console.log("CLUB NOT FOUND FOR SLUG:", slug);
  setLoading(false);
  return;
}

    setClub(clubData);

    /* ===============================
   Club gebruiker ophalen
=============================== */

const res = await fetch("/api/admin/get-club-user", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ clubId: clubData.id }),
});

const userData = await res.json();
setClubUser(userData.user);

    /* ===============================
   Monthly reports ophalen
=============================== */

const { data: reportsData } = await supabase
  .from("monthly_reports")
  .select("*")
  .eq("club_id", clubData.id)
  .order("month", { ascending: false })
  .limit(12);

setReports(reportsData ?? []);

    const { data: jobsData } = await supabase
      .from("jobs")
      .select("id, title, company_name, created_at, featured, archived_at")
      .eq("club_id", clubData.id)
      .is("archived_at", null)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    const jobIds = (jobsData ?? []).map((j) => j.id);

    // ===============================
// Extra statistieken berekenen
// ===============================

const totalVacancies = jobsData?.length ?? 0;

const featuredCount =
  jobsData?.filter((j) => j.featured).length ?? 0;

// Totaal clicks
const { count: totalClicks } = await supabase
  .from("job_clicks")
  .select("*", { count: "exact", head: true })
  .in("job_id", jobIds);

// Clicks deze maand
const startOfMonth = new Date();
startOfMonth.setDate(1);
startOfMonth.setHours(0, 0, 0, 0);

const { count: monthClicks } = await supabase
  .from("job_clicks")
  .select("*", { count: "exact", head: true })
  .in("job_id", jobIds)
  .gte("created_at", startOfMonth.toISOString());

setStats({
  totalVacancies,
  totalClicks: totalClicks ?? 0,
  monthClicks: monthClicks ?? 0,
  featuredCount,
});

    const { data: clicks } = await supabase
      .from("job_clicks")
      .select("job_id, created_at")
      .in("job_id", jobIds);

    const stats: Record<string, { total: number; last: string | null }> = {};

    (clicks ?? []).forEach((c) => {
      if (!stats[c.job_id]) stats[c.job_id] = { total: 0, last: null };
      stats[c.job_id].total++;
      stats[c.job_id].last = c.created_at;
    });

    setJobs(
      (jobsData ?? []).map((j) => ({
        ...j,
        total_clicks: stats[j.id]?.total ?? 0,
        last_click: stats[j.id]?.last ?? null,
      }))
    );

    setLoading(false);
  }

  useEffect(() => {
  if (!slug) return;
  load();
}, [slug]);

  /* ---------- Acties ---------- */

  async function toggleFeatured(jobId: string, current: boolean) {
    const res = await fetch("/api/jobs/toggle-featured", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, featured: !current }),
    });

    if (!res.ok) {
      alert("Uitlichten mislukt");
      return;
    }

    load();
  }

  async function archiveJob(jobId: string) {
    if (!confirm("Weet je zeker dat je deze vacature wilt verwijderen?")) return;

    await supabase
      .from("jobs")
      .update({ archived_at: new Date().toISOString(), featured: false })
      .eq("id", jobId);

    await supabase
      .from("club_ads")
      .update({ archived_at: new Date().toISOString() })
      .eq("job_id", jobId)
      .is("archived_at", null);

    load();
  }

  if (loading) return <p>Laden…</p>;
  if (!club) return null;

  const primary = club.primary_color || "#0d1b2a";

  async function retryReport(reportId: string) {
  if (!confirm("Rapport opnieuw versturen?")) return;

  try {
    const res = await fetch("/api/admin/retry-monthly-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reportId }),
    });

    if (!res.ok) throw new Error();

    alert("Rapport opnieuw verstuurd.");
    load(); // refresh data
  } catch {
    alert("Opnieuw versturen mislukt.");
  }
}

async function deactivateUser() {
  if (!clubUser) return;
  if (!confirm("Weet je zeker dat je deze gebruiker wilt deactiveren?")) return;

  await fetch("/api/admin/deactivate-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: clubUser.id }),
  });

  setClubUser(null);
}

async function inviteUser() {
  if (!newEmail) return;

  await fetch("/api/admin/invite-club-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: newEmail,
      clubId: club?.id,
    }),
  });

  alert("Uitnodiging verzonden");
  setNewEmail("");
  load();
}

  /* ---------- Render ---------- */

  return (
    <div className="space-y-8">
{/* ======================================
   ADMIN PERFORMANCE DASHBOARD
====================================== */}

<motion.div
  className="bg-white text-black rounded-2xl shadow p-6"
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
>
  <div className="flex justify-between items-center mb-6">
    <div>
      <h1 className="text-2xl font-semibold">
        {club.name} – Performance overzicht
      </h1>
      <p className="text-sm text-gray-500">
        Admin controlepaneel
      </p>
    </div>

    <div className="text-right text-sm">
      <p className="text-gray-500">Publieke pagina</p>
      <a
        href={`/club/${club.slug}/jobs/public`}
        target="_blank"
        className="text-blue-600 underline"
      >
        https://www.sponsorjobs.nl/club/{club.slug}/jobs/public
      </a>
    </div>
  </div>

  {/* Stat cards */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-slate-50 p-4 rounded-xl">
      <p className="text-xs text-gray-500">Actieve vacatures</p>
      <p className="text-2xl font-semibold">
        {stats.totalVacancies}
      </p>
    </div>

    <div className="bg-slate-50 p-4 rounded-xl">
      <p className="text-xs text-gray-500">Totaal clicks</p>
      <p className="text-2xl font-semibold">
        {stats.totalClicks}
      </p>
    </div>

    <div className="bg-slate-50 p-4 rounded-xl">
      <p className="text-xs text-gray-500">Clicks deze maand</p>
      <p className="text-2xl font-semibold">
        {stats.monthClicks}
      </p>
    </div>

    <div className="bg-slate-50 p-4 rounded-xl">
      <p className="text-xs text-gray-500">Uitgelichte vacatures</p>
      <p className="text-2xl font-semibold">
        {stats.featuredCount}
      </p>
    </div>
  </div>
</motion.div>
      <motion.div
        className="bg-white text-black rounded-2xl shadow p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1
              className="text-xl font-semibold"
              style={{ color: primary }}
            >
              {club.name}
            </h1>
            <p className="text-sm text-gray-500">
              Vacatures en advertenties
            </p>
          </div>

          <button
            onClick={() => router.push("/admin")}
            className="px-4 py-2 text-sm border rounded-lg"
          >
            Terug
          </button>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#0d1b2a] text-white text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Vacature</th>
                <th className="px-4 py-3 text-center">Clicks</th>
                <th className="px-4 py-3 text-center">Laatste click</th>
                <th className="px-4 py-3 text-center">Acties</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className={`border-b last:border-b-0 ${
                    job.featured ? "bg-yellow-50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {job.featured && "⭐ "}
                      {job.title}
                    </div>
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
                    <button
                      onClick={() =>
                        window.open(
                          `/club/${club.slug}/jobs/public`,
                          "_blank"
                        )
                      }
                      className="border px-2 py-1 rounded"
                      title="Publieke vacatures bekijken"
                    >
                      👁
                    </button>

                    <button
                      onClick={() =>
                        router.push(
                          `/club/${club.slug}/jobs/${job.id}/edit`
                        )
                      }
                      className="border px-2 py-1 rounded"
                      title="Bewerken"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() =>
                        toggleFeatured(job.id, job.featured)
                      }
                      className="border px-2 py-1 rounded"
                      title="Uitlichten"
                    >
                      ⭐
                    </button>

                    <button
                      onClick={() => archiveJob(job.id)}
                      className="border px-2 py-1 rounded text-red-600"
                      title="Verwijderen"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}

              {jobs.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-gray-500"
                  >
                    Geen vacatures gevonden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
            </motion.div>

         <motion.div
  className="bg-white text-black rounded-2xl shadow p-6"
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
>
  <h2 className="text-lg font-semibold mb-4">
    Club gebruiker
  </h2>

  {clubUser ? (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-500">Login e-mail</p>
        <p className="font-medium">{clubUser.email}</p>
      </div>

      <button
        onClick={deactivateUser}
        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
      >
        Deactiveer gebruiker
      </button>
    </div>
  ) : (
    <p className="text-gray-500 mb-4">
      Geen actieve gebruiker gekoppeld.
    </p>
  )}

  <div className="mt-6 border-t pt-6 space-y-3">
    <p className="text-sm font-medium">
      Nieuwe gebruiker uitnodigen
    </p>

    <input
      type="email"
      value={newEmail}
      onChange={(e) => setNewEmail(e.target.value)}
      placeholder="email@club.nl"
      className="w-full border px-3 py-2 rounded-lg text-sm"
    />

    <button
      onClick={inviteUser}
      className="bg-black text-white px-4 py-2 rounded-lg text-sm"
    >
      Verstuur uitnodiging
    </button>
  </div>
</motion.div>   

      {/* ===============================
          Maandrapport geschiedenis
      =============================== */}

      <motion.div
        className="bg-white text-black rounded-2xl shadow p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-semibold mb-4">
          Maandrapport geschiedenis
        </h2>

        {reports.length === 0 ? (
          <p className="text-gray-500">
            Nog geen rapporten verstuurd.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#0d1b2a] text-white text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Maand</th>
                  <th className="px-4 py-3 text-center">Vacatures</th>
                  <th className="px-4 py-3 text-center">Clicks</th>
                  <th className="px-4 py-3 text-center">Groei</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Opened</th>
                  <th className="px-4 py-3 text-center">Actie</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="px-4 py-3">
                      {new Date(r.month).toLocaleDateString("nl-NL", {
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {r.total_vacancies}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {r.total_clicks}
                    </td>

                    <td
                      className={`px-4 py-3 text-center font-medium ${
                        r.growth >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {r.growth > 0 ? "+" : ""}
                      {r.growth}%
                    </td>

                    <td className="px-4 py-3 text-center">
                      {r.status === "sent"
                        ? "✅ Sent"
                        : "❌ Failed"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {r.opened_count ?? 0}x
                    </td>

                    <td className="px-4 py-3 text-center">
                      {r.status === "failed" ? (
  <button
    onClick={() => retryReport(r.id)}
    className="text-blue-600 underline"
  >
    Retry
  </button>
) : (
  <button
    onClick={() =>
      window.open(
        `/api/admin/view-monthly-report/${r.id}`,
        "_blank"
      )
    }
    className="text-blue-600 underline"
  >
    Bekijk
  </button>
)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

    </div>
  );
}
