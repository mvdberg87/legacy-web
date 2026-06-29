"use client";

import ExecutiveSummary from "./ExecutiveSummary";
import ExecutiveAlerts from "./ExecutiveAlerts";
import BenchmarkDashboard from "./BenchmarkDashboard";
import SuccessFactors from "./SuccessFactors";
import SponsorjobsIQ from "./SponsorjobsIQ";
import ExecutiveBriefing from "./ExecutiveBriefing";
import Recommendations from "./Recommendations";

type Dashboard = Awaited<
  ReturnType<
    typeof import("@/lib/admin/intelligence/buildExecutiveDashboard").buildExecutiveDashboard
  >
>;

type Props = {
  dashboard: Dashboard;
};

export default function ExecutiveDashboard({
  dashboard,
}: Props) {
  return (
    <div className="space-y-8">

        <ExecutiveBriefing
  score={dashboard.briefing.score}
  items={dashboard.briefing.items}
/>

      <ExecutiveSummary
        summary={dashboard.executive.summary}
      />

      <Recommendations
  recommendations={dashboard.recommendations}
/>

      <ExecutiveAlerts
        alerts={dashboard.alerts}
      />

      <SponsorjobsIQ
        insights={dashboard.sponsorjobsIQ}
      />

      <BenchmarkDashboard
        benchmarks={dashboard.executive.benchmarks}
      />

      <SuccessFactors
        factors={dashboard.successFactors}
      />

    </div>
  );
}