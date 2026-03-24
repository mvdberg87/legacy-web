"use client";

import ClubSupportBar from "@/components/ClubSupportBar";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import ClubNavbar from "@/components/club/ClubNavbar";
import { AGREEMENT_VERSION, AGREEMENT_CHANGES } from "@/lib/constants";
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

  // 👇 NIEUW
  agreement_accepted?: boolean | null;
  agreement_version?: string | null;
};

type ClubDashboardInsights = {
  active_jobs: number;
  total_ads: number;
  total_clicks: number;
  total_pageviews: number;
  ctr: string;
  total_shares: number;
  share_rate: string;
  last_activity_at: string | null;
};

type SponsorOverviewRow = {
  sponsor_name: string;
  total_jobs: number;
  total_clicks: number;
  total_shares: number;
  ctr: string;
  share_rate: string;
  last_activity_at: string | null;
};

const PACKAGE_ORDER: PackageKey[] = [
  "basic",
  "plus",
  "pro",
  "unlimited",
];

export default function ClubDashboardPage() {
  console.log("DASHBOARD COMPONENT RENDERED");
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();

  const [club, setClub] = useState<Club | null>(null);
  const [insights, setInsights] =
    useState<ClubDashboardInsights | null>(null);
  const [sponsors, setSponsors] =
    useState<SponsorOverviewRow[]>([]);

  const [adsCount, setAdsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAgreement, setShowAgreement] = useState(false);
const [selectedPackage, setSelectedPackage] = useState<PackageKey | null>(null);
const [accepted, setAccepted] = useState(false);

  /* =====================================================
     DATA OPHALEN
  ===================================================== */

useEffect(() => {
  if (searchParams.get("upgrade") === "success") {
    // 🔥 verwijder query param uit URL
    const url = new URL(window.location.href);
    url.searchParams.delete("upgrade");
    window.history.replaceState({}, "", url.toString());

    // 🔥 reload 1x (zonder loop)
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
}, [searchParams]);

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
  subscription_cancelled_at,
  agreement_accepted,
  agreement_version
`)
        .eq("slug", slug)
        .maybeSingle();

      if (!clubData) return setLoading(false);
      console.log("DASHBOARD CLUB ID:", clubData.id);

      setClub(clubData);


      /* ===============================
   Pageviews ophalen
=============================== */

const { count: totalPageviews } = await supabase
  .from("club_page_views")
  .select("id", { count: "exact", head: true })
  .eq("club_id", clubData.id);

const pageviews = totalPageviews ?? 0;

console.log("PAGEVIEWS COUNT:", totalPageviews);

      /* ===============================
         1️⃣ Actieve vacatures
      =============================== */

      const { data: jobs } = await supabase
        .from("jobs")
        .select("id, company_name")
        .eq("club_id", clubData.id)
        .is("archived_at", null);

      const jobIds = jobs?.map((j) => j.id) ?? [];

      let totalClicks = 0;

const sponsorMap: Record<string, SponsorOverviewRow> = {};

      // sponsorMap initialiseren
jobs?.forEach((job) => {
  if (!sponsorMap[job.company_name]) {
    sponsorMap[job.company_name] = {
      sponsor_name: job.company_name,
      total_jobs: 0,
      total_clicks: 0,
      total_shares: 0,
      ctr: "0.0",
      share_rate: "0.0",
      last_activity_at: null,
    };
  }

  sponsorMap[job.company_name].total_jobs++;
});



      /* ===============================
         2️⃣ Clicks ophalen (LEIDEND)
      =============================== */

if (jobIds.length > 0) {
  const { data: clicks } = await supabase
    .from("job_clicks")
    .select("job_id, created_at, ip_address")
    .in("job_id", jobIds);

  totalClicks = clicks?.length ?? 0;

  // clicks tellen per sponsor
  clicks?.forEach((click) => {
    const job = jobs?.find(
      (j) => j.id === click.job_id
    );
    if (!job) return;

    const sponsor = sponsorMap[job.company_name];

    sponsor.total_clicks++;

    if (
      !sponsor.last_activity_at ||
      new Date(click.created_at) >
        new Date(sponsor.last_activity_at)
    ) {
      sponsor.last_activity_at = click.created_at;
    }
  });
}

/* ===============================
   TeamApp shares ophalen
=============================== */

let sharesData = [];

if (jobIds.length > 0) {
  const { data } = await supabase
    .from("job_shares")
    .select("job_id, created_at")
    .in("job_id", jobIds);

  sharesData = data ?? [];
}

const shares = sharesData.length;

// shares tellen per sponsor
sharesData?.forEach((share) => {
  const job = jobs?.find((j) => j.id === share.job_id);
  if (!job) return;

  const sponsor = sponsorMap[job.company_name];

  if (!sponsor.total_shares) sponsor.total_shares = 0;

  sponsor.total_shares++;

  if (
    !sponsor.last_activity_at ||
    new Date(share.created_at) >
      new Date(sponsor.last_activity_at)
  ) {
    sponsor.last_activity_at = share.created_at;
  }
});

/* ===============================
   Ads shares toevoegen
=============================== */

const { data: adShares } = await supabase
  .from("job_shares")
  .select("job_id, created_at")
  .eq("club_id", clubData.id);

if (adShares) {
  adShares.forEach((share) => {
    if (!sharesData.find((s) => s.job_id === share.job_id)) {
      sharesData.push(share);
    }
  });
}

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

const ctr =
  pageviews > 0
    ? ((totalClicks / pageviews) * 100).toFixed(1)
    : "0.0";
    
    const shareRate =
  pageviews > 0
    ? ((shares / pageviews) * 100).toFixed(1)
    : "0.0";
      /* ===============================
         4️⃣ KPI samenstellen
      =============================== */

      setInsights({
  active_jobs: jobIds.length,
  total_ads: ads ?? 0,
  total_clicks: totalClicks,
  total_pageviews: pageviews,
  ctr,
  total_shares: shares,
  share_rate: shareRate,
  last_activity_at:
    Object.values(sponsorMap)
      .map((s) => s.last_activity_at)
      .filter(Boolean)
      .sort()
      .pop() ?? null,
});

Object.values(sponsorMap).forEach((s) => {

  const views = pageviews || 0;

  s.ctr =
    views > 0
      ? ((s.total_clicks / views) * 100).toFixed(1)
      : "0.0";

  s.share_rate =
    views > 0
      ? ((s.total_shares / views) * 100).toFixed(1)
      : "0.0";

});

setSponsors(Object.values(sponsorMap));

            setLoading(false);
    })();
  }, []);

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
  club.subscription_status === "active"
    ? "Actief"
    : club.subscription_status === "past_due"
    ? "Betaling mislukt"
    : club.subscription_status === "cancelled"
    ? "Geannuleerd"
    : club.subscription_status === "blocked"
    ? "Geblokkeerd"
    : club.subscription_status ?? "Onbekend";

      const isBillingBlocked =
  club.subscription_status === "past_due" ||
  club.subscription_status === "cancelled";

const isPaid = club.active_package !== "basic";

const needsUpdate =
  isPaid &&
  (
    !club.agreement_version ||
    club.agreement_version !== AGREEMENT_VERSION
  );

  const changes = AGREEMENT_CHANGES[AGREEMENT_VERSION] || [];

  /* ===============================
               5️⃣ Upgrade status
            =============================== */
      
       async function goToCheckout(targetPackage: PackageKey) {
  if (!club) return;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const email = user?.email;

    const priceMap = {
      basic: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC,
      plus: process.env.NEXT_PUBLIC_STRIPE_PRICE_PLUS,
      pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
      unlimited: process.env.NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED,
    };

    const priceId = priceMap[targetPackage];

    if (!priceId) {
      alert("Geen priceId gevonden");
      return;
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  clubId: club.id,
  clubSlug: slug,
  packageKey: targetPackage,
  priceId,
  email,
  agreementAccepted: true, // 🔥 TOEVOEGEN
}),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Checkout mislukt");
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Geen Stripe checkout URL ontvangen");
    }

  } catch (err) {
    console.error("Checkout error:", err);
    alert("Server fout bij checkout.");
  }
}
      
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

  {needsUpdate && (
  <div className="mb-6 p-5 rounded-xl bg-yellow-50 border border-yellow-300 text-yellow-900 text-sm">

    <div className="font-semibold mb-2">
      ⚠️ De samenwerkingsovereenkomst is bijgewerkt
    </div>

    <p className="mb-3">
      Om Sponsorjobs te blijven gebruiken dien je opnieuw akkoord te gaan.
    </p>

    {changes.length > 0 && (
      <ul className="list-disc pl-5 mb-4 space-y-1">
        {changes.map((change, i) => (
          <li key={i}>{change}</li>
        ))}
      </ul>
    )}

    <button
      onClick={() =>
        (window.location.href = `/club/${slug}/agreement-required`)
      }
      className="px-4 py-2 bg-[#0d1b2a] text-white rounded-lg text-sm"
    >
      Bekijk overeenkomst
    </button>
  </div>
)}

{club.subscription_status === "past_due" && (
  <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm">
    ⚠️ Je betaling is mislukt.
    <br />
    Volgende incassopoging vóór:{" "}
    <strong>
      {club.subscription_end
        ? new Date(
            club.subscription_end
          ).toLocaleDateString("nl-NL")
        : "onbekend"}
    </strong>
    <br />
    Update je betaalgegevens om blokkade te voorkomen.
  </div>
)}

{club.subscription_status === "cancelled" && (
  <div className="mb-6 p-4 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm">
    ❌ Je abonnement is geannuleerd. 
    Upgrade opnieuw om functies te herstellen.
  </div>
)}

{/* ===============================
   Publieke vacaturepagina
=============================== */}
<section className="border-2 rounded-xl p-6 bg-gray-50 mb-10">
  <h2 className="font-semibold text-lg mb-2">
    Publieke vacaturepagina
  </h2>

  <p className="text-sm text-gray-600 mb-4">
    Deel deze link op jullie website of social media:
  </p>

  {(() => {
    const publicUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/${slug}`
        : "";

    return (
      <>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-3">
          <input
            readOnly
            value={publicUrl}
            className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white"
          />

          <button
            onClick={() =>
              navigator.clipboard.writeText(publicUrl)
            }
            className="bg-[#0d1b2a] hover:bg-[#132a44] text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Kopieer link
          </button>
        </div>

        <div className="mt-2 mb-4">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Bekijk publieke pagina →
          </a>
        </div>
      </>
    );
  })()}

  <ul className="text-sm text-gray-600 space-y-1">
    <li>• Plaats deze link onder ‘Vacatures’ op jullie website</li>
    <li>• Gebruik deze URL voor social media posts</li>
    <li>• Gebruik deze link in sponsorcommunicatie</li>
  </ul>
</section>

        <section className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-10">

<InsightCard
  label="Pageviews"
  value={insights?.total_pageviews ?? 0}
/>

<InsightCard
  label="Clicks"
  value={insights?.total_clicks ?? 0}
/>

<InsightCard
  label="CTR"
  value={`${insights?.ctr ?? "0.0"} %`}
/>

<InsightCard
  label="Social shares"
  value={insights?.total_shares ?? 0}
/>

<InsightCard
  label="Share rate"
  value={`${insights?.share_rate ?? "0.0"} %`}
/>

<InsightCard
  label="Advertenties actief"
  value={`${adsCount} / ${subscription.ads}`}
/>

</section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">
            Sponsors & vacatures
          </h2>

          <div className="border-4 border-[#0d1b2a] rounded-xl overflow-hidden">
  <table className="min-w-full text-sm">
            <thead className="bg-[#0d1b2a] text-white border-b-4 border-[#0d1b2a]">
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
  CTR
</th>
<th className="px-4 py-2 text-center">
  Shares
</th>
<th className="px-4 py-2 text-center">
  Share rate
</th>
<th className="px-4 py-2 text-center">
  Laatste activiteit
</th>
              </tr>
            </thead>
            <tbody className="[&>tr:nth-child(even)]:bg-gray-50">
              {sponsors.map((s) => (
                <tr
  key={s.sponsor_name}
  className="border-t border-[#0d1b2a] hover:bg-gray-100 transition"
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
  {s.ctr} %
</td>

<td className="px-4 py-2 text-center">
  {s.total_shares ?? 0}
</td>

<td className="px-4 py-2 text-center">
  {s.share_rate} %
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
        </div>
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
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
  className={`border-2 rounded-xl p-4 text-center flex flex-col h-full ${
    isCurrent
  ? "bg-gray-100 border-4 border-green-600"
  : "bg-white"
  }`}
>
                  <h3 className="font-semibold text-lg">
                    {SUBSCRIPTIONS[key].label}
                  </h3>

                  <p className="text-2xl font-bold my-2">
  €{SUBSCRIPTIONS[key].pricePerMonth}
  <span className="text-sm font-normal">
    {" "}
    / maand
  </span>
</p>

<p className="text-sm font-medium text-[#0d1b2a] mb-3">
  {`${SUBSCRIPTIONS[key].ads} ${
  SUBSCRIPTIONS[key].ads === 1
    ? "advertentie"
    : "advertenties"
}`}
</p>

                  <button
  disabled={!canUpgrade || isBillingBlocked}
  onClick={() => {
  if (!canUpgrade) return;

  setSelectedPackage(key);
  setShowAgreement(true);
}}
  className={`mt-auto w-full py-2 rounded-lg text-sm font-medium ${
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
  ? isBillingBlocked
    ? "Geblokkeerd"
    : "Upgrade"
  : "–"}
</button>
                </div>
              );
            })}
          </div>
        </section>
        {/* ===============================
            Support balk
        =============================== */}
        <ClubSupportBar />
      </motion.div>
      {showAgreement && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl">

      <h2 className="text-lg font-semibold mb-3">
        Bevestig upgrade
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Door verder te gaan ga je akkoord met de{" "}
        <a href="/voorwaarden" target="_blank" className="underline">
          samenwerkingsovereenkomst
        </a>.
      </p>

      <label className="flex items-center gap-2 mb-4 text-sm">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
        Ik ga akkoord met de overeenkomst
      </label>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setShowAgreement(false);
            setAccepted(false);
          }}
          className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
        >
          Annuleren
        </button>

        <button
          disabled={!accepted || !selectedPackage}
          onClick={() => {
            if (!selectedPackage) return;
            goToCheckout(selectedPackage);
          }}
          className="px-4 py-2 text-sm bg-[#0d1b2a] text-white rounded-lg disabled:opacity-50"
        >
          Doorgaan naar betaling
        </button>
      </div>
    </div>
  </div>
)}
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
