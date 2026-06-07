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

  const [loading, setLoading] =
    useState(true);

  async function load() {

    const { data } =
      await supabase
        .from(
          "club_advertisements_overview"
        )
        .select("*")
        .eq("slug", slug)
        .is("deleted_at", null)
        .order("end_date");

    setAds(data ?? []);

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <p>Laden...</p>;
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

    <div className="max-w-5xl mx-auto bg-white border-2 rounded-2xl p-5 sm:p-8 shadow-md mt-6">

      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 leading-tight">
  <span className="block">
    Advertenties
  </span>

  <span className="block text-base sm:text-2xl font-normal text-gray-600 mt-1">
    Overzicht advertentieverkopen
  </span>
</h1>

      <div className="grid grid-cols-2 md:grid-cols-8 gap-4 mb-8">

        <div className="border-2 rounded-xl p-5 bg-white text-center">
          <div className="text-2xl font-bold">
            {activeAds.length}
          </div>

          <div>
            Actieve advertenties
          </div>
        </div>

        <div className="border-2 rounded-xl p-5 bg-white text-center">
          <div className="text-2xl font-bold">
            €
            {totalRevenue.toLocaleString(
              "nl-NL"
            )}
          </div>

          <div>
            Club opbrengst
          </div>
        </div>

        <div className="border-2 rounded-xl p-5 bg-white text-center">
  <div className="text-2xl font-bold">
    €
    {totalTurnover.toLocaleString(
      "nl-NL"
    )}
  </div>

  <div>Advertentie omzet</div>
</div>

<div className="border-2 rounded-xl p-5 bg-white text-center">
  <div className="text-2xl font-bold">
    {featuredAds.length}
  </div>

  <div>Featured</div>
</div>

<div className="border-2 rounded-xl p-5 bg-white text-center">
  <div className="text-2xl font-bold">
    {renewals.length}
  </div>

  <div>Auto Renew</div>
</div>

<div className="border-2 rounded-xl p-5 bg-white text-center">
  <div className="text-2xl font-bold">
    {expires90Days.length}
  </div>

  <div>&lt; 90 dagen</div>
</div>

<div className="border-2 rounded-xl p-5 bg-white text-center">
  <div className="text-2xl font-bold">
    {expires30Days.length}
  </div>

  <div>&lt; 30 dagen</div>
</div>

<div className="border-2 rounded-xl p-5 bg-white text-center">
  <div className="text-2xl font-bold">
    €
    {expectedRenewalRevenue.toLocaleString(
      "nl-NL"
    )}
  </div>

  <div>Verwachte renewal</div>
</div>

      </div>

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

<th className="p-3 text-center">
  Featured
</th>

              <th className="p-3 text-center">
                Renewal
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
                className="border-b"
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
  {ad.is_featured ? "⭐" : "-"}
</td>

                <td className="p-3 text-center">
                  {ad.auto_renew
                    ? "🔄"
                    : "⛔"}
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
    </main>
  );
}