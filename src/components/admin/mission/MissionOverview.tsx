"use client";

import MissionCard from "./ui/MissionCard";
import MissionMetric from "./ui/MissionMetric";

type Props = {
  mission: any;
};

export default function MissionOverview({
  mission,
}: Props) {

  return (

    <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">

      <MissionCard>

        <MissionMetric
          label="Platform Health"
          value={mission.platform.health.score}
        />

      </MissionCard>

      <MissionCard>

        <MissionMetric
          label="MRR"
          value={`€${mission.revenue.metrics.mrr}`}
        />

      </MissionCard>

      <MissionCard>

        <MissionMetric
          label="Discovery"
          value={mission.discovery.opportunities.length}
        />

      </MissionCard>

      <MissionCard>

        <MissionMetric
          label="Top Actions"
          value={mission.actions.actions.length}
        />

      </MissionCard>

    </div>

  );

}