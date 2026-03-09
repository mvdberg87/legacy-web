"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { useRouter } from "next/navigation";

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null;

  const styles: Record<string, string> = {
    trial: "bg-yellow-100 text-yellow-800",
    active: "bg-green-100 text-green-800",
    pending_payment: "bg-orange-100 text-orange-800",
    blocked: "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function getHealthScore(club: Club) {

  const ctr =
    club.pageviews > 0
      ? (club.total_clicks / club.pageviews) * 100
      : 0;

  if (club.active_jobs === 0) {
    return { label: "Inactive", color: "text-red-600" };
  }

  if (ctr > 15) {
    return { label: "Healthy", color: "text-green-600" };
  }

  if (ctr > 5) {
    return { label: "Needs attention", color: "text-yellow-600" };
  }

  return { label: "Low engagement", color: "text-red-500" };
}

function getGrowthScore(club: Club) {

  let score = 0;

  const ctr =
    club.pageviews > 0
      ? (club.total_clicks / club.pageviews) * 100
      : 0;

  const shareRate =
    club.pageviews > 0
      ? (club.total_shares / club.pageviews) * 100
      : 0;

  if (club.active_jobs >= 3) score += 2;
  if (ctr >= 10) score += 2;
  if (club.total_shares >= 5) score += 2;
  if (club.pageviews >= 100) score += 2;

  if (score >= 7)
    return { label: "🚀 High growth", color: "text-green-600" };

  if (score >= 4)
    return { label: "📈 Growing", color: "text-blue-600" };

  if (score >= 2)
    return { label: "🟡 Stable", color: "text-yellow-600" };

  return { label: "🔴 Low activity", color: "text-red-600" };
}

function getClubScore(club: Club) {

  let score = 0;

  const ctr =
    club.pageviews
      ? (club.total_clicks / club.pageviews) * 100
      : 0;

  const shareRate =
    club.pageviews
      ? (club.total_shares / club.pageviews) * 100
      : 0;

  if (club.active_jobs >= 3) score += 20;
  if (ctr >= 10) score += 20;
  if (club.total_shares >= 5) score += 20;
  if (club.pageviews >= 100) score += 20;

  if (ctr >= 15) score += 20;

  return score;
}

type Club = {
  id: string;
  name: string;
  slug: string;

  active_package: string;
  subscription_status: string | null;

  active_jobs: number | null;

  total_clicks: number | null;
  total_shares: number | null;

  pageviews: number | null;
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
const leaderboard = [...clubs]
  .map((club) => ({
    ...club,
    score: getClubScore(club),
  }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);

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

{/* KPI GRID */}
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

{/* TOP CLUBS LEADERBOARD */}
<div className="bg-gray-50 border rounded-xl p-4 mb-6">
  <h2 className="font-semibold mb-3">🏆 Top Clubs</h2>

  <div className="space-y-2">
    {leaderboard.map((club, index) => (
      <div
        key={club.id}
        className="flex justify-between text-sm"
      >
        <span>
          {index === 0 && "🥇 "}
          {index === 1 && "🥈 "}
          {index === 2 && "🥉 "}
          {index > 2 && `${index + 1}. `}
          {club.name}
        </span>

        <span className="font-semibold">
          {club.score}
        </span>
      </div>
    ))}
  </div>
</div>

      <table className="w-full text-sm">
        <thead className="bg-[#0d1b2a] text-white text-xs uppercase">
  <tr>
<th className="px-4 py-3 text-left">Club</th>
<th className="px-4 py-3 text-center">Pakket</th>
<th className="px-4 py-3 text-center">Status</th>
<th className="px-4 py-3 text-center">Health</th>
<th className="px-4 py-3 text-center">Growth</th>
<th className="px-4 py-3 text-center">Score</th>
<th className="px-4 py-3 text-center">Vacatures</th>
<th className="px-4 py-3 text-center">Pageviews</th>
<th className="px-4 py-3 text-center">Clicks</th>
<th className="px-4 py-3 text-center">CTR</th>
<th className="px-4 py-3 text-center">Shares</th>
<th className="px-4 py-3 text-center">Share rate</th>
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
  <StatusBadge status={club.subscription_status} />
</td>

<td className="px-4 py-3 text-center">
  {(() => {
    const health = getHealthScore(club);
    return (
      <span className={`font-medium ${health.color}`}>
        {health.label}
      </span>
    );
  })()}
</td>

<td className="px-4 py-3 text-center">
  {(() => {
    const growth = getGrowthScore(club);
    return (
      <span className={`font-medium ${growth.color}`}>
        {growth.label}
      </span>
    );
  })()}
</td>

<td className="px-4 py-3 text-center font-semibold">
  {getClubScore(club)} / 100
</td>

<td className="px-4 py-3 text-center">
  {club.active_jobs ?? 0}
</td>

<td className="px-4 py-3 text-center">
  {club.total_clicks ?? 0}
</td>

<td className="px-4 py-3 text-center">
  {club.total_shares ?? 0}
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
  {club.pageviews
    ? ((club.total_shares / club.pageviews) * 100).toFixed(1) + "%"
    : "0%"}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}