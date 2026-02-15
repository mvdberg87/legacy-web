"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";


/* ---------- Types ---------- */

type AdminAdOverviewRow = {
  club_id: string;
  club_name: string;
  slug: string;
  subscription_package: string | null;
  total_ads: number;
  featured_ads: number;
  total_clicks: number;
};

/* ---------- Limieten ---------- */

const AD_LIMITS: Record<string, number> = {
  basic: 0,
  plus: 3,
  pro: 10,
  unlimited: Infinity,
};

const FEATURED_LIMITS: Record<string, number> = {
  basic: 0,
  plus: 1,
  pro: 3,
  unlimited: Infinity,
};

/* ---------- Page ---------- */

export default function AdminAdsOverviewPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const router = useRouter();

  const [rows, setRows] = useState<AdminAdOverviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("admin_ad_overview")
        .select("*")
        .order("club_name");

      if (error) {
        console.error("Admin ads overview fout:", error);
        setRows([]);
      } else {
        setRows(data ?? []);
      }

      setLoading(false);
    })();
  }, [supabase]);

  /* ---------- Render ---------- */

  return (
    <div className="space-y-8">
      <div className="bg-white text-black rounded-2xl shadow p-6">
        <h1 className="text-xl font-semibold mb-6">
          Advertentie-overzicht
        </h1>

        {loading ? (
          <p>Laden…</p>
        ) : rows.length === 0 ? (
          <p className="text-gray-500 italic">
            Geen clubs met advertenties gevonden.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#0d1b2a] text-white text-xs uppercase">
                <tr>
                  <th className="px-3 py-3 text-left">Club</th>
                  <th className="px-3 py-3">Pakket</th>
                  <th className="px-3 py-3 text-center">Ads</th>
                  <th className="px-3 py-3 text-center">Featured</th>
                  <th className="px-3 py-3 text-center">Clicks</th>
                  <th className="px-3 py-3 text-center">Acties</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r, i) => {
                  const pkg = r.subscription_package ?? "basic";
                  const adsOver =
                    r.total_ads > (AD_LIMITS[pkg] ?? 0);
                  const featuredOver =
                    r.featured_ads >
                    (FEATURED_LIMITS[pkg] ?? 0);

                  return (
                    <motion.tr
                      key={r.club_id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className={`border-b last:border-b-0 ${
                        adsOver || featuredOver
                          ? "bg-red-50"
                          : "hover:bg-blue-50/40"
                      }`}
                    >
                      <td className="px-3 py-3 font-medium">
                        {r.club_name}
                      </td>
                      <td className="px-3 py-3">{pkg}</td>
                      <td className="px-3 py-3 text-center">
                        {r.total_ads}
                      </td>
                      <td className="px-3 py-3 text-center">
                        ⭐ {r.featured_ads}
                      </td>
                      <td className="px-3 py-3 text-center">
                        👆 {r.total_clicks}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/clubs/${r.slug}`
                            )
                          }
                          className="text-blue-600 hover:underline"
                        >
                          Beheer
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
