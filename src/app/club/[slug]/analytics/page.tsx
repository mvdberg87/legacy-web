// src/app/club/[slug]/analytics/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

type JobStat = {
  job_id: string;
  title: string;
  likes: number;
  clicks: number;
};

type Club = {
  name: string;
  primary_color?: string | null;
  secondary_color?: string | null;
};

export default function ClubAnalyticsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [stats, setStats] = useState<JobStat[]>([]);
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function fetchData() {
      try {
        const [statsRes, clubRes] = await Promise.all([
          fetch(`/api/analytics/${slug}`),
          fetch(`/api/club/${slug}`),
        ]);

        const statsData = await statsRes.json();
        const clubData = await clubRes.json();

        setStats(statsData);
        setClub(clubData);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) return <div className="p-6">Statistieken laden…</div>;

  const primary = club?.primary_color || "#0046ad";
  const secondary = club?.secondary_color || "#f2f2f2";

  return (
    <main
      className="min-h-screen p-6"
      style={{
        backgroundColor: secondary,
        color: primary === "#ffffff" ? "#111" : primary,
      }}
    >
      <h1 className="text-3xl font-bold mb-4">
        📊 Statistieken – {club?.name ?? slug}
      </h1>

      <p className="opacity-80 mb-8">
        Overzicht van interacties met vacatures (likes ❤️ en klikgedrag 🖱️).
      </p>

      {/* ✅ Recharts visualisatie */}
      <div className="w-full h-[400px] bg-white/10 rounded-2xl shadow border border-white/30 p-4 mb-10 backdrop-blur-sm">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={stats}
            margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis
              dataKey="title"
              angle={-25}
              textAnchor="end"
              interval={0}
              tick={{ fill: primary }}
              height={80}
            />
            <YAxis tick={{ fill: primary }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: `1px solid ${primary}`,
                color: "#000000",
              }}
            />
            <Legend />
            <Bar
              dataKey="likes"
              fill={primary}
              radius={[6, 6, 0, 0]}
              name="❤️ Likes"
            />
            <Bar
              dataKey="clicks"
              fill="#10b981" // groen (Tailwind emerald)
              radius={[6, 6, 0, 0]}
              name="🖱️ Kliks"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Tabel met ruwe data */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse bg-white/10 rounded-2xl backdrop-blur-sm">
          <thead>
            <tr className="border-b border-white/30 text-sm uppercase">
              <th className="p-3">Vacature</th>
              <th className="p-3 text-center">❤️ Likes</th>
              <th className="p-3 text-center">🖱️ Kliks</th>
              <th className="p-3 text-center">🔁 Ratio (kliks/likes)</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => {
              const ratio =
                s.likes > 0 ? ((s.clicks / s.likes) * 100).toFixed(1) + "%" : "-";
              return (
                <tr
                  key={s.job_id}
                  className="border-b border-white/20 hover:bg-white/10 transition-colors"
                >
                  <td className="p-3">{s.title}</td>
                  <td className="p-3 text-center">{s.likes}</td>
                  <td className="p-3 text-center">{s.clicks}</td>
                  <td className="p-3 text-center">{ratio}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
