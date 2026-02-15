"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import ClubNavbar from "@/components/club/ClubNavbar";
import {
  SUBSCRIPTIONS,
  type PackageKey,
} from "@/lib/subscriptions";

/* ===============================
   Types
   =============================== */

type Club = {
  id: string;
  name: string;
  active_package: PackageKey;
  primary_color?: string | null;
  subscription_start?: string | null;
  subscription_end?: string | null;
  subscription_status?: string | null;
  subscription_cancelled_at?: string | null;
};

type ClubDashboardInsights = {
  active_jobs: number;
  total_ads: number;
  total_clicks: number;
  last_activity_at: string | null;
};

type SponsorOverviewRow = {
  sponsor_name: string;
  total_jobs: number;
  total_clicks: number;
  last_activity_at: string | null;
};

type UpgradeRequest = {
  status: "pending" | "approved" | "rejected";
};

const PACKAGE_ORDER: PackageKey[] = [
  "basic",
  "plus",
  "pro",
  "unlimited",
];

export default function ClubDashboardPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const { slug } = useParams<{ slug: string }>();

  const [club, setClub] = useState<Club | null>(null);
  const [insights, setInsights] =
    useState<ClubDashboardInsights | null>(null);
  const [sponsors, setSponsors] =
    useState<SponsorOverviewRow[]>([]);
  const [upgradeRequest, setUpgradeRequest] =
    useState<UpgradeRequest | null>(null);

  const [adsCount, setAdsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [requestingUpgrade, setRequestingUpgrade] =
    useState(false);

  /* =====================================================
     DATA OPHALEN
  ===================================================== */

  useEffect(() => {
    (async () => {
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
        .select(`
          id,
          name,
          active_package,
          primary_color,
          subscription_start,
          subscription_end,
          subscription_status,
          subscription_cancelled_at
        `)
        .eq("id", profile.club_id)
        .maybeSingle();

      if (!clubData) return setLoading(false);

      setClub(clubData);

      /* ===============================
         1️⃣ Actieve vacatures
      =============================== */

      const { data: jobs } = await supabase
        .from("jobs")
        .select("id, company_name")
        .eq("club_id", clubData.id)
        .is("archived_at", null);

      const jobIds = jobs?.map((j) => j.id) ?? [];

      /* ===============================
         2️⃣ Clicks ophalen (LEIDEND)
      =============================== */

      let totalClicks = 0;
      const sponsorMap: Record<string, SponsorOverviewRow> = {};

      if (jobIds.length > 0) {
        const { data: clicks } = await supabase
          .from("job_clicks")
          .select("job_id, created_at")
          .in("job_id", jobIds);

        totalClicks = clicks?.length ?? 0;

        // vacatures tellen per sponsor
        jobs?.forEach((job) => {
          if (!sponsorMap[job.company_name]) {
            sponsorMap[job.company_name] = {
              sponsor_name: job.company_name,
              total_jobs: 0,
              total_clicks: 0,
              last_activity_at: null,
            };
          }
          sponsorMap[job.company_name].total_jobs++;
        });

        // clicks tellen per sponsor
        clicks?.forEach((click) => {
          const job = jobs?.find(
            (j) => j.id === click.job_id
          );
          if (!job) return;

          const sponsor =
            sponsorMap[job.company_name];

          sponsor.total_clicks++;

          if (
            !sponsor.last_activity_at ||
            new Date(click.created_at) >
              new Date(sponsor.last_activity_at)
          ) {
            sponsor.last_activity_at =
              click.created_at;
          }
        });
      }

      setSponsors(
        Object.values(sponsorMap).sort(
          (a, b) => b.total_clicks - a.total_clicks
        )
      );

      /* ===============================
         3️⃣ Advertenties tellen
      =============================== */

      const { count: ads } = await supabase
        .from("club_ads")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("club_id", clubData.id)
        .eq("is_active", true)
        .is("archived_at", null);

      setAdsCount(ads ?? 0);

      /* ===============================
         4️⃣ KPI samenstellen
      =============================== */

      setInsights({
        active_jobs: jobIds.length,
        total_ads: ads ?? 0,
        total_clicks: totalClicks,
        last_activity_at:
          Object.values(sponsorMap)
            .map((s) => s.last_activity_at)
            .filter(Boolean)
            .sort()
            .pop() ?? null,
      });

      /* ===============================
         5️⃣ Upgrade status
      =============================== */

      const { data: upgrade } = await supabase
        .from("club_upgrade_requests")
        .select("status")
        .eq("club_id", clubData.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      setUpgradeRequest(upgrade ?? null);

      setLoading(false);
    })();
  }, [supabase]);

  async function requestUpgrade(
    targetPackage: PackageKey
  ) {
    if (!club || requestingUpgrade) return;

    setRequestingUpgrade(true);

    await fetch("/api/club/request-upgrade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clubId: club.id,
        packageKey: targetPackage,
      }),
    });

    setRequestingUpgrade(false);
  }

  /* ===============================
     STATES
  =============================== */

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Laden…
      </main>
    );
  }

  if (!club) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Club niet gevonden
      </main>
    );
  }

  const activePackage =
    club.active_package ?? "basic";
  const subscription =
    SUBSCRIPTIONS[activePackage];

  const formatDate = (d?: string | null) =>
    d
      ? new Date(d).toLocaleDateString("nl-NL")
      : "Nog niet ingesteld";

  const statusLabel =
    club.subscription_status === "trial"
      ? "Proefperiode"
      : club.subscription_status === "active"
      ? "Actief"
      : club.subscription_status === "blocked"
      ? "Geblokkeerd"
      : club.subscription_status ??
        "Onbekend";

  /* ===============================
     RENDER
  =============================== */

  return (
    <main className="min-h-screen p-6 bg-[#0d1b2a]">
      <ClubNavbar slug={slug} />

      <motion.div
        className="max-w-5xl mx-auto bg-white border-2 rounded-2xl p-8 shadow-md mt-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-semibold mb-6">
          Dashboard – {club.name}
        </h1>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <InsightCard
            label="Actieve vacatures"
            value={insights?.active_jobs ?? 0}
          />
          <InsightCard
            label="Advertenties"
            value={insights?.total_ads ?? 0}
          />
          <InsightCard
            label="Totaal clicks"
            value={insights?.total_clicks ?? 0}
          />
          <InsightCard
            label="Advertenties actief"
            value={`${adsCount} / ${
              subscription.ads === Infinity
                ? "∞"
                : subscription.ads
            }`}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">
            Sponsors & vacatures
          </h2>

          <table className="min-w-full text-sm border-2 rounded-xl overflow-hidden">
            <thead className="bg-[#0d1b2a] text-white">
              <tr>
                <th className="px-4 py-2 text-left">
                  Sponsor
                </th>
                <th className="px-4 py-2 text-center">
                  Vacatures
                </th>
                <th className="px-4 py-2 text-center">
                  Clicks
                </th>
                <th className="px-4 py-2 text-center">
                  Laatste activiteit
                </th>
              </tr>
            </thead>
            <tbody>
              {sponsors.map((s) => (
                <tr
                  key={s.sponsor_name}
                  className="border-t"
                >
                  <td className="px-4 py-2">
                    {s.sponsor_name}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {s.total_jobs}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {s.total_clicks}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {s.last_activity_at
                      ? new Date(
                          s.last_activity_at
                        ).toLocaleDateString(
                          "nl-NL"
                        )
                      : "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Abonnement blijft exact zoals je had */}
        <section className="border-2 rounded-xl p-6 bg-gray-50">
          <h2 className="font-semibold text-lg mb-2">
            Abonnement
          </h2>

          <p className="text-sm mb-4">
            Status: <strong>{statusLabel}</strong>
            <br />
            Huidig pakket:{" "}
            <strong>{subscription.label}</strong>
            <br />
            Ingangsdatum:{" "}
            <strong>
              {formatDate(
                club.subscription_start
              )}
            </strong>
            <br />
            Einddatum:{" "}
            <strong>
              {formatDate(
                club.subscription_end
              )}
            </strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(Object.keys(
              SUBSCRIPTIONS
            ) as PackageKey[]).map((key) => {
              const currentIndex = PACKAGE_ORDER.indexOf(club.active_package);
const thisIndex = PACKAGE_ORDER.indexOf(key);

const isCurrent = thisIndex === currentIndex;
const isHigher = thisIndex > currentIndex;
const isLower = thisIndex < currentIndex;

const canUpgrade = isHigher;

              return (
                <div
                  key={key}
                  className={`border-2 rounded-xl p-4 text-center ${
                    isCurrent
                      ? "bg-gray-100"
                      : "bg-white"
                  }`}
                >
                  <h3 className="font-semibold text-lg">
                    {SUBSCRIPTIONS[key].label}
                  </h3>

                  <p className="text-2xl font-bold my-2">
                    €
                    {
                      SUBSCRIPTIONS[key]
                        .pricePerYear
                    }
                    <span className="text-sm font-normal">
                      {" "}
                      / jaar
                    </span>
                  </p>

                  <button
  disabled={!canUpgrade || requestingUpgrade}
  onClick={() =>
    canUpgrade && requestUpgrade(key)
  }
  className={`w-full py-2 rounded-lg text-sm font-medium ${
    isCurrent
      ? "bg-gray-300 text-gray-600"
      : isHigher
      ? "bg-green-600 hover:bg-green-700 text-white"
      : "bg-gray-200 text-gray-400 cursor-default"
  }`}
>
  {isCurrent
    ? "Huidig pakket"
    : isHigher
    ? "Upgrade"
    : "–"}
</button>
                </div>
              );
            })}
          </div>
        </section>
      </motion.div>
    </main>
  );
}

function InsightCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="border-2 rounded-xl p-5 bg-white text-center">
      <div className="text-2xl font-semibold">
        {value}
      </div>
      <div className="text-xs uppercase text-gray-500 mt-1">
        {label}
      </div>
    </div>
  );
}
