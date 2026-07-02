"use client";

import { useEffect, useState } from "react";

import {
  buildMissionControl,
} from "@/lib/admin/intelligence/mission/engine";

import MissionControl
from "@/components/admin/mission/MissionControl";

import type {
  MissionControlDashboard,
} from "@/lib/admin/intelligence/mission/types";


export default function AdminDashboardPage() {
  const [mission, setMission] =
  useState<MissionControlDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  (async () => {
    const dashboard =
      await buildMissionControl();

    setMission(dashboard);

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

  return (
  <main className="min-h-screen bg-[#0d1b2a] text-white p-4 md:p-8">
    <div className="max-w-7xl mx-auto">

  <h1 className="text-3xl font-semibold mb-10">
    Sponsorjobs SaaS Intelligence
  </h1>

  {mission && (

    <MissionControl
      mission={mission}
    />

  )}

</div>
  </main>
);
}
