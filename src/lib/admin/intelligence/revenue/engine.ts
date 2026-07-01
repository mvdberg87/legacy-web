import {
  calculateRevenueMetrics,
  type RevenueClub,
  type RevenueAdvertisement,
} from "./metrics";

import {
  calculateRevenueCharts,
} from "./charts";

import {
  calculateRevenueHealth,
} from "./health";

export type RevenueDashboard = {
  metrics: ReturnType<
    typeof calculateRevenueMetrics
  >;

  charts: ReturnType<
    typeof calculateRevenueCharts
  >;

  health: ReturnType<
    typeof calculateRevenueHealth
  >;
};

export function buildRevenueDashboard(
  clubs: RevenueClub[],
  advertisements: RevenueAdvertisement[]
): RevenueDashboard {

  const metrics =
    calculateRevenueMetrics(
      clubs,
      advertisements
    );

  const charts =
    calculateRevenueCharts(
      clubs,
      advertisements
    );

    const health =
  calculateRevenueHealth(
    metrics
  );

  return {

    metrics,

    charts,

    health,

  };

}