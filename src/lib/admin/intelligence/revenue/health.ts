import type { RevenueMetrics } from "./metrics";

export type RevenueHealth = {
  score: number;
  label: string;
  color: "green" | "blue" | "yellow" | "orange" | "red";
};

export function calculateRevenueHealth(
  metrics: RevenueMetrics
): RevenueHealth {

  let score = 0;

  // MRR
  if (metrics.mrr >= 1000) score += 20;
  else if (metrics.mrr >= 500) score += 15;
  else if (metrics.mrr >= 250) score += 10;

  // Churn
  if (metrics.churnRate <= 2) score += 20;
  else if (metrics.churnRate <= 5) score += 15;
  else if (metrics.churnRate <= 10) score += 8;

  // NRR
  if (metrics.nrr >= 110) score += 20;
  else if (metrics.nrr >= 100) score += 15;
  else if (metrics.nrr >= 90) score += 8;

  // Conversie
  if (metrics.conversionRate >= 30) score += 20;
  else if (metrics.conversionRate >= 20) score += 15;
  else if (metrics.conversionRate >= 10) score += 8;

  // Platformomzet
  if (metrics.totalPlatformRevenue >= 2000) score += 20;
  else if (metrics.totalPlatformRevenue >= 1000) score += 15;
  else if (metrics.totalPlatformRevenue >= 500) score += 8;

  if (score >= 90) {
    return {
      score,
      label: "Excellent",
      color: "green",
    };
  }

  if (score >= 75) {
    return {
      score,
      label: "Healthy",
      color: "blue",
    };
  }

  if (score >= 55) {
    return {
      score,
      label: "Needs attention",
      color: "yellow",
    };
  }

  if (score >= 35) {
    return {
      score,
      label: "At risk",
      color: "orange",
    };
  }

  return {
    score,
    label: "Critical",
    color: "red",
  };
}