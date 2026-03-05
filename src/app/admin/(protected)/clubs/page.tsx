"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { useRouter } from "next/navigation";

type Club = {
  id: string;
  name: string;
  slug: string;
  active_package: string;
  active_jobs: number;
  total_clicks: number;
  pageviews: number;
};

export default function AdminClubsPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const router = useRouter();

  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
  clubs: 0,
  jobs: 0,
  clicks: 0,
  pageviews: 0,
  ctr: 0,
});

  async function load() {
  const { data, error } = await supabase
    .from("club_admin_overview")
    .select("*")
    .order("name");

  console.log("CLUB ADMIN DATA:", data);
  console.log("CLUB ADMIN ERROR:", error);

  const clubsData = data ?? [];

  setClubs(clubsData);

  const totalJobs = clubsData.reduce(
    (sum, c) => sum + (c.active_jobs ?? 0),
    0
  );

  const totalClicks = clubsData.reduce(
    (sum, c) => sum + (c.total_clicks ?? 0),
    0
  );

  const totalPageviews = clubsData.reduce(
    (sum, c) => sum + (c.pageviews ?? 0),
    0
  );

  const ctr =
    totalPageviews > 0
      ? (totalClicks / totalPageviews) * 100
      : 0;

  setTotals({
    clubs: clubsData.length,
    jobs: totalJobs,
    clicks: totalClicks,
    pageviews: totalPageviews,
    ctr: Number(ctr.toFixed(1)),
  });

  setLoading(false);
}

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p>Laden...</p>;

  return (
    <div className="bg-white text-black rounded-2xl shadow p-6">
      <h1 className="text-xl font-semibold mb-6">
        Clubs overzicht
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">

  <div className="border rounded-xl p-4 text-center">
    <div className="text-2xl font-semibold">
      {totals.clubs}
    </div>
    <div className="text-xs text-gray-500 uppercase">
      Clubs
    </div>
  </div>

  <div className="border rounded-xl p-4 text-center">
    <div className="text-2xl font-semibold">
      {totals.jobs}
    </div>
    <div className="text-xs text-gray-500 uppercase">
      Vacatures
    </div>
  </div>

  <div className="border rounded-xl p-4 text-center">
    <div className="text-2xl font-semibold">
      {totals.clicks}
    </div>
    <div className="text-xs text-gray-500 uppercase">
      Clicks
    </div>
  </div>

  <div className="border rounded-xl p-4 text-center">
    <div className="text-2xl font-semibold">
      {totals.pageviews}
    </div>
    <div className="text-xs text-gray-500 uppercase">
      Pageviews
    </div>
  </div>

  <div className="border rounded-xl p-4 text-center">
    <div className="text-2xl font-semibold">
      {totals.ctr}%
    </div>
    <div className="text-xs text-gray-500 uppercase">
      Gem. CTR
    </div>
  </div>

</div>

      <table className="w-full text-sm">
        <thead className="bg-[#0d1b2a] text-white text-xs uppercase">
  <tr>
    <th className="px-4 py-3 text-left">Club</th>
    <th className="px-4 py-3 text-center">Pakket</th>
    <th className="px-4 py-3 text-center">Vacatures</th>
    <th className="px-4 py-3 text-center">Clicks</th>
    <th className="px-4 py-3 text-center">Pageviews</th>
    <th className="px-4 py-3 text-center">CTR</th>
    <th className="px-4 py-3 text-center">Actie</th>
  </tr>
</thead>

        <tbody>
          {clubs.map((club) => (
            <tr key={club.id} className="border-b">
              <td className="px-4 py-3 font-medium">
                {club.name}
              </td>

              <td className="px-4 py-3 text-center">
  {club.active_package}
</td>

<td className="px-4 py-3 text-center">
  {club.active_jobs ?? 0}
</td>

<td className="px-4 py-3 text-center">
  {club.total_clicks ?? 0}
</td>

<td className="px-4 py-3 text-center">
  {club.pageviews ?? 0}
</td>

<td className="px-4 py-3 text-center">
  {club.pageviews
    ? ((club.total_clicks / club.pageviews) * 100).toFixed(1) + "%"
    : "0%"}
</td>

              <td className="px-4 py-3 text-center">
                <button
                  onClick={() =>
                    router.push(`/admin/clubs/${club.slug}`)
                  }
                  className="text-blue-600 underline"
                >
                  Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}