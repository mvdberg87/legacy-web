"use client";

import { useEffect, useState } from "react";

import { loadMissionData } from "@/lib/admin/data/loadMissionData";

import RevenueDashboard from "@/components/admin/revenue/RevenueDashboard";

import {
  buildRevenueDashboard,
} from "@/lib/admin/intelligence/revenue/engine";

import {
  buildPlatformDashboard,
} from "@/lib/admin/intelligence/platform/engine";

import PlatformDashboard from "@/components/admin/platform/PlatformDashboard";

import ExecutiveDashboard from "@/components/admin/intelligence/ExecutiveDashboard";

import { buildExecutiveDashboard } from "@/lib/admin/intelligence/buildExecutiveDashboard";

import CEOAssistant from "@/components/admin/assistant/CEOAssistant";

import BenchmarkDashboard
from "@/components/admin/benchmark/BenchmarkDashboard";

type Club = {
  id: string;
  active_package: "basic" | "plus" | "pro" | "unlimited";
  subscription_status: string | null;
  subscription_start: string | null;
  subscription_end: string | null;
  subscription_cancelled_at?: string | null; // 👈 toevoegen
};

export default function AdminDashboardPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [advertisementRows, setAdvertisementRows] =
  useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [executiveDashboard, setExecutiveDashboard] =
  useState<Awaited<
    ReturnType<typeof buildExecutiveDashboard>
  > | null>(null);

  useEffect(() => {
  (async () => {
    const [
  dashboard,
  missionData,
] = await Promise.all([

  buildExecutiveDashboard(),

  loadMissionData(),

]);

    setExecutiveDashboard(dashboard);

    setClubs(
  missionData.clubs
);

setAdvertisementRows(
  missionData.advertisements
);

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

  const revenue =
  buildRevenueDashboard(
    clubs,
    advertisementRows
  );

  const platform =
  buildPlatformDashboard(
    executiveDashboard?.executive.summary.intelligenceScore ?? 0,
    revenue.health.score,
    revenue.metrics.mrr,
    clubs.length
  );

  return (
  <main className="min-h-screen bg-[#0d1b2a] text-white p-4 md:p-8">
    <div className="max-w-7xl mx-auto">

      <h1 className="text-3xl font-semibold mb-10">
        Sponsorjobs SaaS Intelligence
      </h1>

      <PlatformDashboard
  platform={platform}
/>

      {executiveDashboard && (
  <>
    <ExecutiveDashboard
      dashboard={executiveDashboard}
    />

    <BenchmarkDashboard
      benchmark={executiveDashboard.benchmark}
    />

    <CEOAssistant
      assistant={executiveDashboard.assistant}
    />
  </>
)}

      <RevenueDashboard
        revenue={revenue}
      />

    </div>
  </main>
);
}
