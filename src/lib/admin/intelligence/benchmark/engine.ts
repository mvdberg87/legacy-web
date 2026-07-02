import { rankClubs } from "./ranking";
import { buildBenchmarkResults } from "./comparison";

import {
  generateBenchmarkInsights,
} from "./insights";

import {
  generateBenchmarkRecommendations,
} from "./recommendations";

import type {
  BenchmarkDashboard,
  BenchmarkInsight,
  BenchmarkRecommendation,
} from "./types";

export function buildBenchmarkDashboard(
  clubs: any[]
): BenchmarkDashboard {

  const ranking =
    buildBenchmarkResults(
      rankClubs(clubs)
    );

  const insights: Record<
  string,
  BenchmarkInsight[]
> = {};

  const recommendations: Record<
  string,
  BenchmarkRecommendation[]
> = {};

  ranking.forEach((club) => {

    insights[club.clubId] =
      generateBenchmarkInsights(
        club
      );

    recommendations[
      club.clubId
    ] =
      generateBenchmarkRecommendations(
        club
      );

  });

  return {

    ranking,

    insights,

    recommendations,

  };

}