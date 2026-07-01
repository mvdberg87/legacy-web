"use client";

import DecisionCenter from "./DecisionCenter";

import type { PlatformDashboard } from "@/lib/admin/intelligence/platform/types";

type Props = {
  platform: PlatformDashboard;
};

export default function PlatformDashboard({
  platform,
}: Props) {
  return (
  <>
    <div className="bg-[#08111d] rounded-3xl p-8 mb-12">

      <div className="text-gray-400 uppercase text-sm">
        Platform Intelligence
      </div>

      <div className="flex items-center gap-8 mt-4">

        <div>

          <div className="text-6xl font-bold">
            {platform.health.score}
          </div>

          <div className="text-green-400">
            {platform.health.label}
          </div>

        </div>

        <div className="grid grid-cols-3 gap-8 flex-1">

          <div>
            <div className="text-gray-400">
              Forecast MRR
            </div>

            <div className="text-3xl font-semibold">
              €{platform.forecast.mrrNextMonth}
            </div>
          </div>

          <div>
            <div className="text-gray-400">
              Verwachte clubs
            </div>

            <div className="text-3xl font-semibold">
              {platform.forecast.clubsNextMonth}
            </div>
          </div>

          <div>
            <div className="text-gray-400">
              Opportunities
            </div>

            <div className="text-3xl font-semibold">
              {platform.opportunities.length}
            </div>
          </div>

        </div>

      </div>

    </div>

    <DecisionCenter
      decisions={platform.decisions}
    />

  </>
);}