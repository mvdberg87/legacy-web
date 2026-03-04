"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { SUBSCRIPTIONS } from "@/lib/subscriptions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";

type Club = {
  id: string;
  active_package: "basic" | "plus" | "pro" | "unlimited";
  subscription_status: string | null;
  subscription_start: string | null;
  subscription_end: string | null;
};

export default function AdminDashboardPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("clubs")
        .select(
          "id, active_package, subscription_status, subscription_start, subscription_end"
        );

      setClubs(data ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Laden…
      </main>
    );
  }

  /* ===============================
     BASIC / PAID LOGIC
  =============================== */

  const paidClubs = clubs.filter(
    (c) =>
      c.subscription_status === "active" &&
      c.active_package !== "basic"
  );

  const basicClubs = clubs.filter(
    (c) => c.active_package === "basic"
  );

  const mrr = paidClubs.reduce(
    (sum, club) =>
      sum +
      SUBSCRIPTIONS[club.active_package].pricePerMonth,
    0
  );

  const arr = mrr * 12;
  const arpu =
    paidClubs.length > 0
      ? mrr / paidClubs.length
      : 0;

  /* ===============================
     CHURN & NRR
  =============================== */

  const cancelledClubs = clubs.filter(
    (c) => c.subscription_status === "cancelled"
  );

  const totalPaidCustomers =
  paidClubs.length + cancelledClubs.length;

const churnRate =
  totalPaidCustomers > 0
    ? (cancelledClubs.length / totalPaidCustomers) * 100
    : 0;

  const expansionRevenue = 0; // (vereenvoudigd – geen upgrade history)
  const revenueLost = cancelledClubs.reduce(
    (sum, club) =>
      sum +
      (club.active_package !== "basic"
        ? SUBSCRIPTIONS[club.active_package]
            .pricePerMonth
        : 0),
    0
  );

  const nrr =
    mrr > 0
      ? ((mrr + expansionRevenue - revenueLost) /
          mrr) *
        100
      : 100;

  const ltv =
    churnRate > 0
      ? (arpu / (churnRate / 100)).toFixed(0)
      : "∞";

  const conversionRate =
    clubs.length > 0
      ? ((paidClubs.length / clubs.length) * 100).toFixed(
          1
        )
      : "0";

  /* ===============================
     UPGRADE FUNNEL
  =============================== */

  const funnelData = [
    { stage: "Basic", value: basicClubs.length },
    {
      stage: "Plus",
      value: clubs.filter(
        (c) => c.active_package === "plus"
      ).length,
    },
    {
      stage: "Pro",
      value: clubs.filter(
        (c) => c.active_package === "pro"
      ).length,
    },
    {
      stage: "Unlimited",
      value: clubs.filter(
        (c) => c.active_package === "unlimited"
      ).length,
    },
  ];

  /* ===============================
     COHORT (by start month)
  =============================== */

  const cohorts: Record<string, number> = {};

  paidClubs.forEach((club) => {
    if (!club.subscription_start) return;

    const date = new Date(club.subscription_start);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

    cohorts[key] = (cohorts[key] ?? 0) + 1;
  });

  const cohortData = Object.entries(cohorts).map(
    ([month, value]) => ({
      month,
      value,
    })
  );

  /* ===============================
   ROLLING MRR BY MONTH
=============================== */

const mrrByMonth: Record<string, number> = {};

paidClubs.forEach((club) => {
  if (!club.subscription_start) return;

  const date = new Date(club.subscription_start);
  const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

  const price =
    SUBSCRIPTIONS[club.active_package].pricePerMonth;

  mrrByMonth[key] =
    (mrrByMonth[key] ?? 0) + price;
});

const mrrChartData = Object.entries(mrrByMonth).map(
  ([month, value]) => ({
    month,
    value,
  })
);

/* ===============================
   CLUB GROWTH PER MONTH
=============================== */

const clubGrowth: Record<string, number> = {};

clubs.forEach((club) => {
  if (!club.subscription_start) return;

  const date = new Date(club.subscription_start);
  const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

  clubGrowth[key] = (clubGrowth[key] ?? 0) + 1;
});

const clubGrowthData = Object.entries(clubGrowth).map(
  ([month, value]) => ({
    month,
    value,
  })
);

  return (
    <main className="min-h-screen bg-[#0d1b2a] text-white p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-semibold mb-10">
          📊 Sponsorjobs SaaS Intelligence
        </h1>

        {/* KPI GRID */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-6 mb-12">
          <Kpi label="MRR" value={`€${mrr}`} />
          <Kpi label="ARR" value={`€${arr}`} />
          <Kpi label="ARPU" value={`€${arpu.toFixed(0)}`} />
          <Kpi label="Churn %" value={`${churnRate.toFixed(2)}%`} />
          <Kpi label="NRR %" value={`${nrr.toFixed(1)}%`} />
          <Kpi label="LTV" value={`€${ltv}`} />
          <Kpi label="Conversion %" value={`${conversionRate}%`} />
        </div>

        {/* FUNNEL */}
<div className="bg-[#132a44] rounded-2xl p-8 mb-12">
  <h2 className="text-xl font-semibold mb-6">
    Upgrade Funnel
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={funnelData}>
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
    <LineChart data={cohortData}>
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
    <LineChart data={mrrChartData}>
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
    <LineChart data={clubGrowthData}>
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

      </div>
    </main>
  );
}

function Kpi({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-[#132a44] rounded-2xl p-6 text-center">
      <div className="text-2xl font-semibold mb-2">
        {value}
      </div>
      <div className="text-sm text-gray-400 uppercase">
        {label}
      </div>
    </div>
  );
}

