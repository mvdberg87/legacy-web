import type { PlatformHealth } from "./types";

export function calculatePlatformHealth(
  executiveScore: number,
  revenueScore: number
): PlatformHealth {

  const score = Math.round(
    (executiveScore + revenueScore) / 2
  );

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

  if (score >= 60) {
    return {
      score,
      label: "Attention",
      color: "yellow",
    };
  }

  return {
    score,
    label: "Critical",
    color: "red",
  };
}