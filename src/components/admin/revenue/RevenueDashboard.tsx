"use client";

import RevenueHealth from "./RevenueHealth";
import RevenueMetrics from "./RevenueMetrics";
import RevenueCharts from "./RevenueCharts";

type Props = {
  revenue: any;
};

export default function RevenueDashboard({
  revenue,
}: Props) {
  return (
    <div className="space-y-12">

      <RevenueHealth
        health={revenue.health}
      />

      <RevenueMetrics
        metrics={revenue.metrics}
      />

      <RevenueCharts
        charts={revenue.charts}
      />

    </div>
  );
}