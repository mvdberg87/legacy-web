"use client";

import MissionCard from "./ui/MissionCard";
import MissionBadge from "./ui/MissionBadge";
import MissionMetric from "./ui/MissionMetric";

type Props = {
  assistant: any;
  platform: any;
};

export default function MissionHeader({
  assistant,
  platform,
}: Props) {

  return (

    <MissionCard>

      <div className="flex flex-col lg:flex-row justify-between gap-8">

        <div className="flex-1">

          <MissionBadge text="AI Mission Briefing" />

          <h1 className="text-4xl font-bold mt-4">

            {assistant.summary.title}

          </h1>

          <p className="text-gray-400 mt-4 max-w-3xl">

            {assistant.summary.description}

          </p>

        </div>

        <div className="min-w-[220px]">

          <MissionMetric

            label="Mission Score"

            value={platform.health.score}

            trend={platform.health.label}

          />

        </div>

      </div>

    </MissionCard>

  );

}