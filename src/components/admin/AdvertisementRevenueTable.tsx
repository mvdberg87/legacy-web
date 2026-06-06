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

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-3 gap-4">

        <div className="border rounded-xl p-4">
          <div className="text-2xl font-semibold">
            € {totalRevenue}
          </div>
          <div className="text-sm text-gray-500">
            Advertentie omzet
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-2xl font-semibold text-green-600">
            € {totalClubRevenue}
          </div>
          <div className="text-sm text-gray-500">
            Club aandeel
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-2xl font-semibold text-blue-600">
            € {totalPlatformRevenue}
          </div>
          <div className="text-sm text-gray-500">
            Sponsuls aandeel
          </div>
        </div>

      </div>

    </div>
  );
}