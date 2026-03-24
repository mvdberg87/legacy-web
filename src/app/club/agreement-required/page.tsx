"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import {
  AGREEMENT_VERSION,
  AGREEMENT_CHANGES,
} from "@/lib/constants";

export default function AgreementRequiredPage() {
  const supabase = getSupabaseBrowser();
  const { slug } = useParams<{ slug: string }>();

  const [accepted, setAccepted] = useState(false);
  const [clubId, setClubId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const changes = AGREEMENT_CHANGES[AGREEMENT_VERSION] || [];

  /* ===============================
     Club ophalen
  =============================== */
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return setLoading(false);

      const { data: profile } = await supabase
        .from("profiles")
        .select("club_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile?.club_id) {
        setLoading(false);
        return;
      }

      setClubId(profile.club_id);
      setLoading(false);
    })();
  }, []);

  /* ===============================
     Submit
  =============================== */
  async function handleContinue() {
    if (!accepted || !clubId) return;

    setSubmitting(true);

    await fetch("/api/club/accept-agreement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clubId,
      }),
    });

    // 🔥 redirect netjes terug naar dashboard
    window.location.href = `/club/${slug}/dashboard`;
  }

  /* ===============================
     Loading state
  =============================== */
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0d1b2a] text-white">
        Laden…
      </main>
    );
  }

  /* ===============================
     UI
  =============================== */
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0d1b2a] p-6">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-xl">

        <h1 className="text-xl font-semibold mb-3 text-center">
          Bevestig samenwerkingsovereenkomst
        </h1>

        <p className="text-sm text-gray-600 mb-4 text-center">
          Om Sponsorjobs te blijven gebruiken dien je akkoord te gaan met de
          samenwerkingsovereenkomst.
        </p>

        {/* 🔥 CHANGES */}
        {changes.length > 0 && (
          <div className="text-left mb-6">
            <h3 className="font-semibold mb-2 text-sm">
              Wat is er gewijzigd:
            </h3>

            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              {changes.map((change, i) => (
                <li key={i}>{change}</li>
              ))}
            </ul>
          </div>
        )}

        <a
          href="/voorwaarden"
          target="_blank"
          className="text-blue-600 underline text-sm mb-6 block text-center"
        >
          Bekijk volledige overeenkomst
        </a>

        <label className="flex items-center justify-center gap-2 mb-6 text-sm">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          Ik ga akkoord met de overeenkomst
        </label>

        <button
          disabled={!accepted || submitting}
          onClick={handleContinue}
          className="w-full py-3 rounded-lg bg-[#0d1b2a] text-white disabled:opacity-50"
        >
          {submitting ? "Bezig..." : "Akkoord & doorgaan"}
        </button>
      </div>
    </main>
  );
}