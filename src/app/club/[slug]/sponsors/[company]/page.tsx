"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import getSupabaseBrowser from "@/lib/supabaseBrowser";
import ClubNavbar from "@/components/club/ClubNavbar";

/* ---------- Types ---------- */

type Job = {
  id: string;
  title: string;
  apply_url: string;
  created_at: string;
  total_clicks: number;
};

type Club = {
  id: string;
  name: string;
  primary_color?: string | null;
  secondary_color?: string | null;
};

/* ---------- Pagina ---------- */

export default function SponsorDetailPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const router = useRouter();
  const params = useParams();

  const slug = params.slug as string;
  const company = decodeURIComponent(params.company as string);

  const [club, setClub] = useState<Club | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      /* ---------- User ---------- */
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      /* ---------- Profiel → club_id ---------- */
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("club_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError || !profile?.club_id) {
        console.error("❌ Profiel of club_id niet gevonden", profileError);
        setLoading(false);
        return;
      }

      /* ---------- Club ---------- */
      const { data: clubData, error: clubError } = await supabase
        .from("clubs")
        .select("id, name, primary_color, secondary_color")
        .eq("id", profile.club_id)
        .maybeSingle();

      if (clubError || !clubData) {
        console.error("❌ Club niet gevonden", clubError);
        setLoading(false);
        return;
      }

      setClub(clubData);

      /* ---------- Vacatures van sponsor ---------- */
      const { data: jobRows, error: jobError } = await supabase
        .from("jobs")
        .select("id, title, apply_url, created_at")
        .eq("club_id", clubData.id)
        .ilike("company_name", company)
        .is("archived_at", null)
        .order("created_at", { ascending: false });

      if (jobError) {
        console.error("❌ Fout bij laden sponsor vacatures:", jobError);
        setLoading(false);
        return;
      }

      const jobIds = jobRows?.map((j) => j.id) ?? [];

      /* ---------- Clicks ophalen ---------- */
      let clickMap: Record<string, number> = {};

      if (jobIds.length > 0) {
        const { data: clicks, error: clickError } = await supabase
          .from("job_clicks")
          .select("job_id")
          .in("job_id", jobIds);

        if (clickError) {
          console.error("❌ Fout bij laden clicks:", clickError);
        }

        clicks?.forEach((c) => {
          clickMap[c.job_id] = (clickMap[c.job_id] || 0) + 1;
        });
      }

      /* ---------- Samenvoegen ---------- */
      const enrichedJobs: Job[] =
        jobRows?.map((j) => ({
          id: j.id,
          title: j.title,
          apply_url: j.apply_url,
          created_at: j.created_at,
          total_clicks: clickMap[j.id] || 0,
        })) ?? [];

      setJobs(enrichedJobs);
      setLoading(false);
    })();
  }, [supabase, company]);

  /* ---------- Render ---------- */

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Laden…</p>
      </main>
    );
  }

  if (!club) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Club niet gevonden.</p>
      </main>
    );
  }

  const primary = club.primary_color || "#0d1b2a";
  const secondary = club.secondary_color || "#f7f8fa";

  const totalClicks = jobs.reduce((sum, j) => sum + j.total_clicks, 0);

  return (
    <main className="min-h-screen p-6" style={{ backgroundColor: secondary }}>
      <ClubNavbar slug={slug} />

      <motion.div
        className="max-w-5xl mx-auto bg-white border rounded-2xl p-8 shadow-md mt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => router.push(`/club/${slug}/dashboard`)}
          className="text-sm mb-4 text-gray-500 hover:underline"
        >
          ← Terug naar dashboard
        </button>

        <h1 className="text-2xl font-semibold mb-2" style={{ color: primary }}>
          🤝 {company}
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          {jobs.length} vacatures · {totalClicks} clicks
        </p>

        {jobs.length === 0 ? (
          <p className="text-gray-500 italic">
            Geen actieve vacatures voor deze sponsor.
          </p>
        ) : (
          <div className="divide-y border rounded-xl overflow-hidden">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() =>
                  router.push(`/club/${slug}/jobs/${job.id}`)
                }
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 cursor-pointer"
              >
                <div>
                  <div className="font-semibold">{job.title}</div>
                  <div className="text-sm text-gray-500">
                    Geplaatst op{" "}
                    {new Date(job.created_at).toLocaleDateString("nl-NL")}
                  </div>
                </div>

                <div className="text-sm mt-2 sm:mt-0 flex items-center gap-4">
                  <span>👆 {job.total_clicks}</span>
                  <a
                    href={job.apply_url}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 underline"
                  >
                    Bekijk extern
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
