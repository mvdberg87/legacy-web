"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

type Props = {
  charts: any;
};

export default function RevenueCharts({
  charts,
}: Props) {

  return (
  <>
        
        {/* FUNNEL */}
<div className="bg-[#132a44] rounded-2xl p-8 mb-12">
  <h2 className="text-xl font-semibold mb-6">
    Upgrade Funnel
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={charts.funnelData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
      <XAxis dataKey="stage" stroke="#fff" />
      <YAxis stroke="#fff" />
      <Tooltip />
      <Bar dataKey="value" fill="#22c55e" />
    </BarChart>
  </ResponsiveContainer>
</div>

{/* COHORT */}
<div className="bg-[#132a44] rounded-2xl p-8 mb-12">
  <h2 className="text-xl font-semibold mb-6">
    Cohort (Paid Start Month)
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <LineChart
  data={charts.cohortData}
>
      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
      <XAxis dataKey="month" stroke="#fff" />
      <YAxis stroke="#fff" />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#3b82f6"
        strokeWidth={3}
      />
    </LineChart>
  </ResponsiveContainer>
</div>

{/* ROLLING MRR */}
<div className="bg-[#132a44] rounded-2xl p-8">
  <h2 className="text-xl font-semibold mb-6">
    Rolling MRR Growth
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <LineChart
  data={charts.mrrChartData}
>
      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
      <XAxis dataKey="month" stroke="#fff" />
      <YAxis stroke="#fff" />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#22c55e"
        strokeWidth={3}
      />
    </LineChart>
  </ResponsiveContainer>
</div>

{/* CLUB GROWTH */}
<div className="bg-[#132a44] rounded-2xl p-8 mt-12">
  <h2 className="text-xl font-semibold mb-6">
    Club Growth per Month
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <LineChart
  data={charts.clubGrowthData}
>
      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
      <XAxis dataKey="month" stroke="#fff" />
      <YAxis stroke="#fff" />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#f59e0b"
        strokeWidth={3}
      />
    </LineChart>
  </ResponsiveContainer>
</div>

<div className="bg-[#132a44] rounded-2xl p-8 mt-12">
  <h2 className="text-xl font-semibold mb-6">
    Advertentie omzet per club
  </h2>

<div className="overflow-x-auto">
  <table className="w-full text-sm">
    <thead className="bg-[#0d1b2a] text-white">
      <tr>
        <th className="px-4 py-3 text-left">Club</th>
<th className="px-4 py-3 text-right">Omzet</th>
<th className="px-4 py-3 text-right">Club aandeel</th>
<th className="px-4 py-3 text-right">Sponsuls aandeel</th>
      </tr>
    </thead>

    <tbody>
      {(
  Object.entries(
  charts.adRevenueByClub
) as [
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
  className="border-t border-slate-600"
>
            <td className="px-4 py-3 break-words">
  {club}
</td>

<td className="px-4 py-3 text-right">
  € {values.revenue.toLocaleString("nl-NL")}
</td>

<td className="px-4 py-3 text-right text-green-400">
  € {values.clubAmount.toLocaleString("nl-NL")}
</td>

<td className="px-4 py-3 text-right text-blue-400">
  € {values.platformAmount.toLocaleString("nl-NL")}
</td>
          </tr>
        ))}
    </tbody>
        </table>
    </div>
  </div>

    </>
  );
}