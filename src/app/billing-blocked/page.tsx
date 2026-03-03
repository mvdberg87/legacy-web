"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import {
  SUBSCRIPTIONS,
  type PackageKey,
} from "@/lib/subscriptions";

type Insights = {
  active_jobs: number;
  total_clicks: number;
  total_pageviews: number;
};

const PACKAGE_ORDER: PackageKey[] = [
  "plus",
  "pro",
  "unlimited",
];

export default function BillingBlockedPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("club_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile?.club_id) {
        setLoading(false);
        return;
      }

      const clubId = profile.club_id;

      const { data: jobs } = await supabase
        .from("jobs")
        .select("id")
        .eq("club_id", clubId)
        .is("archived_at", null);

      const jobIds = jobs?.map((j) => j.id) ?? [];

      let totalClicks = 0;

      if (jobIds.length > 0) {
        const { data: clicks } = await supabase
          .from("job_clicks")
          .select("id")
          .in("job_id", jobIds);

        totalClicks = clicks?.length ?? 0;
      }

      const { data: pageviews } = await supabase
        .from("club_page_views")
        .select("id")
        .eq("club_id", clubId);

      setInsights({
        active_jobs: jobIds.length,
        total_clicks: totalClicks,
        total_pageviews: pageviews?.length ?? 0,
      });

      setLoading(false);
    })();
  }, []);

  async function goToCheckout(targetPackage: PackageKey) {
    const res = await fetch("/api/billing/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ packageKey: targetPackage }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0d1b2a] text-white">
        Laden…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d1b2a] text-white p-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-semibold mb-4">
            🚫 Je Basic-periode is verlopen
          </h1>
          <p className="text-gray-300">
            Activeer een pakket om vacatures en advertenties weer zichtbaar te maken.
          </p>
        </motion.div>

        {/* KPI BEWIJS */}
        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            <KpiCard
              label="Pageviews"
              value={insights.total_pageviews}
            />
            <KpiCard
              label="Clicks"
              value={insights.total_clicks}
            />
            <KpiCard
              label="Actieve vacatures"
              value={insights.active_jobs}
            />
          </div>
        )}

        {/* PRICING */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PACKAGE_ORDER.map((key) => {
            const pkg = SUBSCRIPTIONS[key];
            const isPro = key === "pro";

            return (
              <div
                key={key}
                className={`rounded-2xl p-8 border ${
                  isPro
                    ? "bg-white text-black scale-105 shadow-xl"
                    : "bg-[#132a44] border-gray-700"
                }`}
              >
                {isPro && (
                  <div className="text-xs uppercase font-semibold text-green-600 mb-2">
                    Meest gekozen
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-2">
                  {pkg.label}
                </h3>

                <p className="text-3xl font-bold mb-4">
                  €{pkg.pricePerMonth}
                  <span className="text-sm font-normal">
                    {" "}
                    / maand
                  </span>
                </p>

                <p className="text-sm mb-6">
                  {pkg.ads === Infinity
                    ? "Onbeperkte advertenties"
                    : `${pkg.ads} ${
                        pkg.ads === 1
                          ? "advertentie"
                          : "advertenties"
                      }`}
                </p>

                <button
                  onClick={() => goToCheckout(key)}
                  className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition"
                >
                  Activeer direct
                </button>
              </div>
            );
          })}
        </div>

        {/* CONTACT */}
        <div className="text-center text-sm text-gray-400">
          Vragen? Mail{" "}
          <a
            href="mailto:info@sponsorjobs.nl"
            className="underline"
          >
            info@sponsorjobs.nl
          </a>
        </div>
      </div>
    </main>
  );
}

function KpiCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-[#132a44] border border-gray-700 rounded-2xl p-6 text-center">
      <div className="text-3xl font-semibold mb-2">
        {value}
      </div>
      <div className="text-sm text-gray-400 uppercase">
        {label}
      </div>
    </div>
  );
}