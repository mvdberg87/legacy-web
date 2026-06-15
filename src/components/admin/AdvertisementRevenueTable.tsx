"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AdvertisementRevenueTable() {

  const supabase = useMemo(
    () => getSupabaseBrowser(),
    []
  );

  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {

    const { data } =
      await supabase
        .from(
          "admin_advertisements_overview"
        )
        .select("*");

    setRows(data || []);
  }

  const totalRevenue =
    rows.reduce(
      (sum, row) =>
        sum + (row.amount || 0),
      0
    );

  const totalClubRevenue =
    rows.reduce(
      (sum, row) =>
        sum +
        (row.club_amount || 0),
      0
    );

  const totalPlatformRevenue =
    rows.reduce(
      (sum, row) =>
        sum +
        (row.platform_amount || 0),
      0
    );

    const clubRevenue = rows.reduce(
  (acc, row) => {
    const club =
      row.club_name || "Onbekend";

    if (!acc[club]) {
      acc[club] = {
        revenue: 0,
        clubAmount: 0,
        platformAmount: 0,
      };
    }

    acc[club].revenue +=
      row.amount || 0;

    acc[club].clubAmount +=
      row.club_amount || 0;

    acc[club].platformAmount +=
      row.platform_amount || 0;

    return acc;
  },
  {} as Record<
    string,
    {
      revenue: number;
      clubAmount: number;
      platformAmount: number;
    }
  >
);

const clubRevenueEntries =
  Object.entries(clubRevenue) as [
    string,
    {
      revenue: number;
      clubAmount: number;
      platformAmount: number;
    }
  ][];


  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <div className="border rounded-xl p-4">
          <div className="text-2xl font-semibold">
            € {totalRevenue.toLocaleString("nl-NL")}
          </div>
          <div className="text-sm text-gray-500">
            Advertentie omzet
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-2xl font-semibold text-green-600">
            € {totalClubRevenue.toLocaleString("nl-NL")}
          </div>
          <div className="text-sm text-gray-500">
            Club aandeel
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-2xl font-semibold text-blue-600">
            € {totalPlatformRevenue.toLocaleString("nl-NL")}
          </div>
          <div className="text-sm text-gray-500">
            Sponsuls aandeel
          </div>
        </div>

      </div>

      <div className="border rounded-xl overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
    <thead className="bg-[#0d1b2a] text-white">
      <tr>
        <th className="px-4 py-3 text-left">
          Club
        </th>

        <th className="px-4 py-3 text-right">
          Advertentie omzet
        </th>

        <th className="px-4 py-3 text-right">
          Club aandeel
        </th>

        <th className="px-4 py-3 text-right">
          Sponsuls aandeel
        </th>
      </tr>
    </thead>

    <tbody>
  {(
    Object.entries(clubRevenue) as [
      string,
      {
        revenue: number;
        clubAmount: number;
        platformAmount: number;
      }
    ][]
  )
    .sort(
      ([, a], [, b]) =>
        b.revenue - a.revenue
    )
    .map(([club, values]) => (
      <tr
        key={club}
        className="border-t"
      >
        <td className="px-4 py-3">
          {club}
        </td>

        <td className="px-4 py-3 text-right">
          €
          {values.revenue.toLocaleString(
            "nl-NL"
          )}
        </td>

        <td className="px-4 py-3 text-right text-green-600">
          €
          {values.clubAmount.toLocaleString(
            "nl-NL"
          )}
        </td>

        <td className="px-4 py-3 text-right text-blue-600">
          €
          {values.platformAmount.toLocaleString(
            "nl-NL"
          )}
        </td>
      </tr>
    ))}
</tbody>
  </table>
</div>

    </div>
    </div>
  );
}