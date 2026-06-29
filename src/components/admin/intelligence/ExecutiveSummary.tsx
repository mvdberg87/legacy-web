"use client";

import MetricCard from "../ui/MetricCard";
import SectionCard from "../ui/SectionCard";

type Props = {
  summary: {
    totalClubs: number;
    intelligenceScore: number;
    averageHealth: number;
  };
};

export default function ExecutiveSummary({
  summary,
}: Props) {
  return (

    <SectionCard
      title="Executive Summary"
      subtitle="Belangrijkste KPI's van Sponsorjobs."
    >

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="Intelligence Score"
          value={`${summary.intelligenceScore}/100`}
          subtitle="Platform gezondheid"
          color="violet"
        />

        <MetricCard
          title="Gem. Health Score"
          value={`${summary.averageHealth}/100`}
          subtitle="Gemiddelde clubscore"
          color="emerald"
        />

        <MetricCard
          title="Actieve Clubs"
          value={summary.totalClubs}
          subtitle="Aangesloten verenigingen"
          color="blue"
        />

        <MetricCard
          title="Platform Status"
          value="Healthy"
          subtitle="Geen kritieke meldingen"
          color="cyan"
        />

      </div>

    </SectionCard>

  );
}