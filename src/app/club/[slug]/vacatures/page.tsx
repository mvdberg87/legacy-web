"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

/* ---------- Types ---------- */

type Job = {
  id: string;
  title: string;
  company_name: string;
  featured: boolean;
};

type JobWithStats = Job & {
  total_clicks: number;
  last_click: string | null;
};

/* ---------- Pagina ---------- */

export default function VacaturesPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const [clubId, setClubId] = useState<string | null>(null);
  const [clubName, setClubName] = useState("");
  const [jobs, setJobs] = useState<JobWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- Data laden ---------- */

  useEffect(() => {
    if (!slug) return;

    (async () => {
      setLoading(true);

      /* 1️⃣ Club */
      const { data: club } = await supabase
        .from("clubs")
        .select("id, name")
        .eq("slug", slug)
        .maybeSingle();

      if (!club) return;

      setClubId(club.id);
      setClubName(club.name);

      /* 2️⃣ Vacatures */
      const { data: jobs } = await supabase
        .from("jobs")
        .select("id, title, company_name, featured")
        .eq("club_id", club.id)
        .is("archived_at", null)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (!jobs || jobs.length === 0) {
        setJobs([]);
        setLoading(false);
        return;
      }

      /* 3️⃣ Clicks */
      const { data: clicks } = await supabase
        .from("job_clicks")
        .select("job_id, created_at")
        .in("job_id", jobs.map((j) => j.id));

      const stats: Record<
        string,
        { total: number; last: string | null }
      > = {};

      (clicks ?? []).forEach((c) => {
        if (!stats[c.job_id]) {
          stats[c.job_id] = { total: 0, last: c.created_at };
        }
        stats[c.job_id].total += 1;

        if (
          !stats[c.job_id].last ||
          new Date(c.created_at) >
            new Date(stats[c.job_id].last!)
        ) {
          stats[c.job_id].last = c.created_at;
        }
      });

      const enriched: JobWithStats[] = jobs.map((j) => ({
        ...j,
        total_clicks: stats[j.id]?.total ?? 0,
        last_click: stats[j.id]?.last ?? null,
      }));

      setJobs(enriched);
      setLoading(false);
    })();
  }, [slug, supabase]);

  /* ---------- Acties ---------- */

  async function deleteJob(jobId: string) {
    if (!confirm("Vacature verwijderen?")) return;

    await supabase
      .from("jobs")
      .update({ archived_at: new Date().toISOString() })
      .eq("id", jobId);

    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }

  async function toggleFeatured(job: JobWithStats) {
    await supabase
      .from("jobs")
      .update({
        featured: !job.featured,
        featured_at: !job.featured
          ? new Date().toISOString()
          : null,
      })
      .eq("id", job.id);

    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id
          ? { ...j, featured: !j.featured }
          : j
      )
    );
  }

  /* ---------- Render ---------- */

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto bg-white border rounded-2xl p-6 shadow">
        <h1 className="text-2xl font-semibold mb-6">
          💼 Vacatures beheren – {clubName}
        </h1>

        {loading ? (
          <p>Laden…</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500 italic">
            Nog geen vacatures.
          </p>
        ) : (
          <table className="min-w-full text-sm border rounded-xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">
                  Functie
                </th>
                <th className="px-4 py-3 text-center">
                  Clicks
                </th>
                <th className="px-4 py-3 text-center">
                  Laatste click
                </th>
                <th className="px-4 py-3 text-center">
                  Beheer
                </th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((j) => (
                <tr
                  key={j.id}
                  className={`border-t ${
                    j.featured ? "bg-yellow-50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium flex items-center gap-2">
                      {j.featured && "⭐"}
                      {j.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {j.company_name}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {j.total_clicks}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {j.last_click
                      ? new Date(j.last_click).toLocaleDateString(
                          "nl-NL"
                        )
                      : "—"}
                  </td>

                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() =>
                        window.open(
                          `/club/${slug}/jobs/${j.id}`,
                          "_blank"
                        )
                      }
                      className="border px-2 py-1 rounded"
                    >
                      👁
                    </button>

                    <button
                      onClick={() =>
                        router.push(
                          `/club/${slug}/jobs/${j.id}/edit`
                        )
                      }
                      className="border px-2 py-1 rounded"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => toggleFeatured(j)}
                      className="border px-2 py-1 rounded"
                      title="Featured aan/uit"
                    >
                      ⭐
                    </button>

                    <button
                      onClick={() => deleteJob(j.id)}
                      className="border px-2 py-1 rounded text-red-600"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
