"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

import RevenueDashboard from "@/components/admin/revenue/RevenueDashboard";

import {
  buildRevenueDashboard,
} from "@/lib/admin/intelligence/revenue/engine";

import ExecutiveDashboard from "@/components/admin/intelligence/ExecutiveDashboard";

import { buildExecutiveDashboard } from "@/lib/admin/intelligence/buildExecutiveDashboard";

type Club = {
  id: string;
  active_package: "basic" | "plus" | "pro" | "unlimited";
  subscription_status: string | null;
  subscription_start: string | null;
  subscription_end: string | null;
  subscription_cancelled_at?: string | null; // 👈 toevoegen
};

export default function AdminDashboardPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
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
      clubsResult,
      adsResult,
    ] = await Promise.all([
      buildExecutiveDashboard(),

      supabase
        .from("clubs")
        .select(
          "id, active_package, subscription_status, subscription_start, subscription_end, subscription_cancelled_at"
        ),

      supabase
        .from("admin_advertisements_overview")
        .select("*"),
    ]);

    setExecutiveDashboard(dashboard);

    setClubs(clubsResult.data ?? []);

    setAdvertisementRows(
      adsResult.data ?? []
    );

    setLoading(false);
  })();
}, [supabase]);

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

  return (
  <main className="min-h-screen bg-[#0d1b2a] text-white p-4 md:p-8">
    <div className="max-w-7xl mx-auto">

      <h1 className="text-3xl font-semibold mb-10">
        Sponsorjobs SaaS Intelligence
      </h1>

      {executiveDashboard && (
        <ExecutiveDashboard
          dashboard={executiveDashboard}
        />
      )}

      <RevenueDashboard
        revenue={revenue}
      />

    </div>
  </main>
);
}
