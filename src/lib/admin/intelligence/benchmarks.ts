/**
 * ============================================================
 * Sponsorjobs Intelligence
 * Benchmark Engine
 * ------------------------------------------------------------
 * Vergelijkt clubs met elkaar en ontdekt patronen.
 *
 * GEEN React
 * GEEN Supabase
 * Alleen pure berekeningen.
 * ============================================================
 */

import {
  calculateCTR,
  calculateShareRate,
} from "./scores";

export type BenchmarkClub = {
  id: string;
  name: string;

  activeJobs: number;

  pageviews: number;

  totalClicks: number;

  totalShares: number;

  healthScore?: number;
};

export type BenchmarkSummary = {
  average: number;
  top10Average: number;
  bottom10Average: number;
};

export function average(values: number[]): number {
  if (values.length === 0) return 0;

  return Number(
    (
      values.reduce((a, b) => a + b, 0) /
      values.length
    ).toFixed(1)
  );
}

export function benchmarkActiveJobs(
  clubs: BenchmarkClub[]
): BenchmarkSummary {

  const jobs = clubs
    .map(c => c.activeJobs)
    .sort((a, b) => b - a);

  return createSummary(jobs);
}

export function benchmarkCTR(
  clubs: BenchmarkClub[]
): BenchmarkSummary {

  const ctrs = clubs
    .map(c =>
      calculateCTR(
        c.totalClicks,
        c.pageviews
      )
    )
    .sort((a, b) => b - a);

  return createSummary(ctrs);
}

export function benchmarkShareRate(
  clubs: BenchmarkClub[]
): BenchmarkSummary {

  const shares = clubs
    .map(c =>
      calculateShareRate(
        c.totalShares,
        c.pageviews
      )
    )
    .sort((a, b) => b - a);

  return createSummary(shares);
}

export function benchmarkPageviews(
  clubs: BenchmarkClub[]
): BenchmarkSummary {

  const views = clubs
    .map(c => c.pageviews)
    .sort((a, b) => b - a);

  return createSummary(views);
}

export function benchmarkHealth(
  clubs: BenchmarkClub[]
): BenchmarkSummary {

  const scores = clubs
    .map(c => c.healthScore ?? 0)
    .sort((a, b) => b - a);

  return createSummary(scores);
}

/* ============================================================
   Helpers
============================================================ */

function createSummary(
  values: number[]
): BenchmarkSummary {

  if (values.length === 0) {
    return {
      average: 0,
      top10Average: 0,
      bottom10Average: 0,
    };
  }

  const averageValue = average(values);

  const groupSize = Math.max(
    1,
    Math.ceil(values.length * 0.1)
  );

  const top = values.slice(0, groupSize);

  const bottom = values.slice(-groupSize);

  return {
    average: averageValue,
    top10Average: average(top),
    bottom10Average: average(bottom),
  };
}