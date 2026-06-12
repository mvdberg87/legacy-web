"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { useParams } from "next/navigation";
import ClubNavbar from "@/components/club/ClubNavbar";

type Advertisement = {
  id: string;
  company_name: string;
  package_name: string;
  status: string;
  end_date: string;
  auto_renew: boolean;
  is_featured: boolean | null;
  amount: number | null;
  club_amount: number | null;

  total_clicks?: number;
  total_shares?: number;
  last_click?: string | null;
  ctr?: string;
share_rate?: string;
};

export default function AdvertisementsPage() {
  const supabase =
    getSupabaseBrowser();

  const params =
    useParams();

  const slug =
    params.slug as string;

  const [ads, setAds] =
    useState<Advertisement[]>(
      []
    );

    const [monthlyReports, setMonthlyReports] =
  useState<any[]>([]);

  const [lifetimeStats, setLifetimeStats] =
  useState({
    revenue: 0,
    advertisements: 0,
    clubRevenue: 0,
  });

  const [loading, setLoading] =
    useState(true);

    const [
  advertisingSalesEnabled,
  setAdvertisingSalesEnabled,
] = useState<boolean | null>(null);

  async function load() {

    const { data: club } =
  await supabase
    .from("clubs")
    .select(
      "advertising_sales_enabled"
    )
    .eq("slug", slug)
    .single();

setAdvertisingSalesEnabled(
  club?.advertising_sales_enabled ??
    false
);

    const { data } =
      await supabase
        .from(
          "club_advertisements_overview"
        )
        .select("*")
        .eq("slug", slug)
        .is("deleted_at", null)
        .order("end_date");

        const clubId = data?.[0]?.club_id;

const { count: pageviews } =
  await supabase
    .from("club_page_views")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("club_id", clubId);


    const adIds = (data ?? []).map((ad) => ad.id);

    const {
  data: clicks,
  error: clicksError,
} = await supabase
  .from("company_advertisement_clicks")
  .select("advertisement_id, created_at")
  .in("advertisement_id", adIds);

console.log("AD IDS", adIds);
console.log("CLICKS", clicks);
console.log("CLICKS ERROR", clicksError);

const {
  data: shares,
  error: sharesError,
} = await supabase
  .from("company_advertisement_shares")
  .select("advertisement_id")
  .in("advertisement_id", adIds);

console.log("SHARES", shares);
console.log("SHARES ERROR", sharesError);

  const clickMap: Record<string, number> = {};
const shareMap: Record<string, number> = {};
const lastClickMap: Record<string, string> = {};

(clicks ?? []).forEach((click) => {
  clickMap[click.advertisement_id] =
    (clickMap[click.advertisement_id] ?? 0) + 1;

  const existing =
    lastClickMap[click.advertisement_id];

  if (
    !existing ||
    new Date(click.created_at) >
      new Date(existing)
  ) {
    lastClickMap[click.advertisement_id] =
      click.created_at;
  }
});

(shares ?? []).forEach((share) => {
  shareMap[share.advertisement_id] =
    (shareMap[share.advertisement_id] ?? 0) + 1;
});

const enrichedAds =
  (data ?? []).map((ad) => {

    const clicks =
      clickMap[ad.id] ?? 0;

    const shares =
      shareMap[ad.id] ?? 0;

    return {
      ...ad,
      total_clicks: clicks,
      total_shares: shares,
      ctr:
        pageviews && pageviews > 0
          ? (
              (clicks / pageviews) *
              100
            ).toFixed(1)
          : "0",

      share_rate:
        pageviews && pageviews > 0
          ? (
              (shares / pageviews) *
              100
            ).toFixed(1)
          : "0",

      last_click:
        lastClickMap[ad.id] ??
        null,
    };
  });

setAds(enrichedAds);

const totalRevenue =
  (data ?? []).reduce(
    (sum, ad) =>
      sum + (ad.amount ?? 0),
    0
  );

const totalClubRevenue =
  (data ?? []).reduce(
    (sum, ad) =>
      sum +
      (ad.club_amount ?? 0),
    0
  );

setLifetimeStats({
  revenue: totalRevenue,
  advertisements:
    data?.length ?? 0,
  clubRevenue:
    totalClubRevenue,
});

setLoading(false);

  const { data: reports } =
  await supabase
    .from("monthly_reports")
    .select(`
      month,
      advertisement_revenue,
      advertisements_sold
    `)
    .eq("club_id", data?.[0]?.club_id)
    .order("month", {
      ascending: false,
    })
    .limit(12);

setMonthlyReports(
  reports ?? []
);
  }

  async function toggleFeatured(
  advertisementId: string
) {
  const ad = ads.find(
    (a) => a.id === advertisementId
  );

  if (!ad) return;

  await fetch(
    "/api/admin/advertisements/highlight",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        advertisementId,
        isFeatured:
          !ad.is_featured,
      }),
    }
  );

  await load();
}

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <p>Laden...</p>;
  }

  if (
  advertisingSalesEnabled === false
) {
  return (
    <main className="min-h-screen p-6 bg-[#0d1b2a]">

      <ClubNavbar slug={slug} />

      <div className="max-w-6xl mx-auto bg-white border-2 rounded-2xl p-10 shadow-md mt-6">

        <h1 className="text-2xl font-semibold mb-4">
          Advertenties
        </h1>

        <p className="text-gray-600">
          Advertentieverkoop is niet geactiveerd voor deze club.
        </p>

      </div>

    </main>
  );
}

  const activeAds =
    ads.filter(
      (a) =>
        a.status === "active"
    );

  const totalRevenue =
    ads.reduce(
      (sum, ad) =>
        sum +
        (ad.club_amount ?? 0),
      0
    );

    const totalTurnover =
  ads.reduce(
    (sum, ad) =>
      sum +
      (ad.amount ?? 0),
    0
  );

const featuredAds =
  ads.filter(
    (a) => a.is_featured
  );

const renewals =
  ads.filter(
    (a) => a.auto_renew
  );

const today = new Date();

const expires90Days =
  ads.filter((a) => {

    const diff =
      (new Date(a.end_date).getTime() -
        today.getTime()) /
      (1000 * 60 * 60 * 24);

    return (
      a.status === "active" &&
      diff <= 90 &&
      diff >= 0
    );
  });

const expires30Days =
  ads.filter((a) => {

    const diff =
      (new Date(a.end_date).getTime() -
        today.getTime()) /
      (1000 * 60 * 60 * 24);

    return (
      a.status === "active" &&
      diff <= 30 &&
      diff >= 0
    );
  });

const expectedRenewalRevenue =
  ads
    .filter(
      (a) =>
        a.auto_renew &&
        a.status === "active"
    )
    .reduce(
      (sum, ad) =>
        sum +
        (ad.club_amount ?? 0),
      0
    );

  return (
  <main className="min-h-screen p-6 bg-[#0d1b2a]">

    <ClubNavbar slug={slug} />

    <div className="max-w-6xl mx-auto bg-white border-2 rounded-2xl p-10 shadow-md mt-6">

      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 leading-tight">
  <span className="block">
    Advertenties
  </span>

  <span className="block text-base sm:text-2xl font-normal text-gray-600 mt-1">
    Overzicht advertentieverkopen
  </span>
</h1>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">

  <div className="border-2 rounded-xl p-5 bg-white text-center">
    <div className="text-2xl font-bold">
      {activeAds.length}
    </div>
    <div>Actieve advertenties</div>
  </div>

  <div className="border-2 rounded-xl p-5 bg-white text-center">
    <div className="text-2xl font-bold">
      €
      {lifetimeStats.clubRevenue.toLocaleString("nl-NL")}
    </div>
    <div>Totale clubopbrengst</div>
  </div>

  <div className="border-2 rounded-xl p-5 bg-white text-center">
    <div className="text-2xl font-bold">
      {lifetimeStats.advertisements}
    </div>
    <div>Verkochte advertenties</div>
  </div>

</div>

      </div>

      <div className="border-2 rounded-2xl overflow-hidden">

  <div className="overflow-x-auto">

    <table className="w-full text-sm">

          <thead className="bg-[#0d1b2a] text-white">

            <tr>

              <th className="p-3 text-left">
  Bedrijf
</th>

<th className="p-3 text-center">
  Pakket
</th>

<th className="p-3 text-center">
  Status
</th>

<th className="p-3 text-center w-20">
  Clicks
</th>

<th className="p-3 text-center w-20">
  CTR
</th>

<th className="p-3 text-center w-20">
  Shares
</th>

<th className="p-3 text-center w-24">
  Share rate
</th>

<th className="p-3 text-center w-32">
  Laatste click
</th>

<th className="p-3 text-center">
  Featured
</th>

<th className="p-3 text-center">
  Loopt tot
</th>

<th className="p-3 text-center">
  Clubdeel
</th>

            </tr>

          </thead>

          <tbody>

            {ads.map((ad) => (

              <tr
  key={ad.id}
  className={`border-b ${
    ad.is_featured ? "bg-yellow-50" : ""
  }`}
>

                <td className="p-3">
                  {ad.company_name}
                </td>

                <td className="p-3 text-center">
                  {ad.package_name}
                </td>

                <td className="p-3 text-center">
  {ad.status}
</td>

<td className="p-3 text-center">
  {ad.total_clicks ?? 0}
</td>

<td className="p-3 text-center">
  {ad.ctr ?? 0}%
</td>

<td className="p-3 text-center">
  {ad.total_shares ?? 0}
</td>

<td className="p-3 text-center">
  {ad.share_rate ?? 0}%
</td>

<td className="p-3 text-center">
  {ad.last_click
    ? new Date(ad.last_click).toLocaleDateString("nl-NL")
    : "-"}
</td>

<td className="p-3 text-center">
  <button
    type="button"
    onClick={() => toggleFeatured(ad.id)}
    className={`
      px-3 py-1 rounded-md text-sm border transition
      ${
        ad.is_featured
          ? "bg-yellow-100 border-yellow-400 text-yellow-800"
          : "hover:bg-gray-50"
      }
    `}
  >
    {ad.is_featured
      ? "⭐ Featured"
      : "Maak featured"}
  </button>
</td>

                <td className="p-3 text-center">
                  {new Date(
                    ad.end_date
                  ).toLocaleDateString(
                    "nl-NL"
                  )}
                </td>

                <td className="p-3 text-center text-green-700">
                  €
                  {ad.club_amount}
                </td>

              </tr>

            ))}

          </tbody>

              </table>

</div>

</div>

<div className="mt-12 border-2 rounded-2xl overflow-hidden bg-white">

  <div className="bg-[#0d1b2a] text-white p-4 font-semibold">
    Advertentie omzet laatste 12 maanden
  </div>

  <table className="w-full text-sm">

    <thead className="bg-gray-100">

      <tr>
        <th className="p-3 text-left">
          Maand
        </th>

        <th className="p-3 text-center">
          Advertenties
        </th>

        <th className="p-3 text-center">
          Omzet
        </th>
      </tr>

    </thead>

    <tbody>

      {monthlyReports.map(
        (report) => (
          <tr
            key={report.month}
            className="border-b"
          >
            <td className="p-3">
              {new Date(
                report.month
              ).toLocaleDateString(
                "nl-NL",
                {
                  month: "long",
                  year: "numeric",
                }
              )}
            </td>

            <td className="p-3 text-center">
              {
                report.advertisements_sold
              }
            </td>

            <td className="p-3 text-center">
              €
              {(
                report.advertisement_revenue ??
                0
              ).toLocaleString(
                "nl-NL"
              )}
            </td>
          </tr>
        )
      )}

    </tbody>

  </table>

</div>

    </div>

</main>

  );
}