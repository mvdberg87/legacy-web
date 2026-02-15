"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import ClubNavbar from "@/components/club/ClubNavbar";

/* ---------- Types ---------- */

type Job = {
  id: string;
  title: string;
  company_name: string;
  description?: string | null;
  apply_url: string;
  created_at: string;
};

type Club = {
  id: string;
  name: string;
  primary_color?: string | null;
};

/* ---------- Page ---------- */

export default function JobDetailPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const router = useRouter();
  const { slug, jobId } = useParams<{ slug: string; jobId: string }>();

  const [club, setClub] = useState<Club | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      /**
       * Club ophalen via slug (publiek & admin-proof)
       */
      const { data: clubData } = await supabase
        .from("clubs")
        .select("id, name, primary_color")
        .eq("slug", slug)
        .maybeSingle();

      /**
       * Vacature ophalen
       */
      const { data: jobData } = await supabase
        .from("jobs")
        .select(
          "id, title, company_name, description, apply_url, created_at"
        )
        .eq("id", jobId)
        .maybeSingle();

      setClub(clubData);
      setJob(jobData);
      setLoading(false);
    })();
  }, [supabase, jobId, slug]);

  async function deleteJob() {
    if (!confirm("Vacature definitief verwijderen?")) return;

    await supabase
      .from("jobs")
      .update({ archived_at: new Date().toISOString() })
      .eq("id", jobId);

    router.push(`/club/${slug}/jobs`);
  }

  if (loading) return <p className="p-6">Laden…</p>;
  if (!job || !club)
    return <p className="p-6">Vacature niet gevonden</p>;

  const primary = club.primary_color || "#0d1b2a";

  return (
    <main className="min-h-screen p-6 bg-[#0d1b2a]">
      <ClubNavbar slug={slug} />

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow mt-6">
        {/* ---------- Titel & bedrijf ---------- */}
        <h1
          className="text-2xl sm:text-3xl font-semibold mb-2"
          style={{ color: primary }}
        >
          {job.title}
        </h1>

        <p className="text-gray-600 mb-6">
          {job.company_name}
        </p>

        {/* ---------- Beschrijving (lees-meer context) ---------- */}
        <div className="prose prose-sm sm:prose max-w-none mb-8 text-gray-800">
          {job.description ? (
            <div
              dangerouslySetInnerHTML={{
                __html: job.description,
              }}
            />
          ) : (
            <p>
              Voor deze vacature is geen uitgebreide beschrijving
              beschikbaar. Klik hieronder om de vacature op de
              website van het bedrijf te bekijken.
            </p>
          )}
        </div>

        {/* ---------- Publieke CTA ---------- */}
        <div className="mb-10">
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full px-6 py-3 text-white font-medium"
            style={{ backgroundColor: primary }}
          >
            Bekijk vacature op website →
          </a>
        </div>

        {/* ---------- Admin acties ---------- */}
        <div className="border-t pt-6 flex flex-wrap gap-3 text-sm">
          <button
            onClick={() =>
              router.push(`/club/${slug}/jobs/${jobId}/edit`)
            }
            className="border px-4 py-2 rounded"
          >
            ✏️ Bewerken
          </button>

          <button
            onClick={deleteJob}
            className="border px-4 py-2 rounded text-red-600"
          >
            🗑 Verwijderen
          </button>
        </div>
      </div>
    </main>
  );
}
