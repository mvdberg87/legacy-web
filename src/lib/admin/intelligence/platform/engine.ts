import {
  calculatePlatformHealth,
} from "./health";

import {
  generatePlatformRisks,
} from "./risks";

import {
  generatePlatformForecast,
} from "./forecast";

import {
  buildDecisionEngine,
} from "./decisionEngine";

import {
  generatePlatformOpportunities,
} from "./opportunities";

import type {
  PlatformDashboard,
} from "./types";

export function buildPlatformDashboard(
  executiveScore: number,
  revenueScore: number,
  mrr: number,
  clubs: number
): PlatformDashboard {

  const health =
    calculatePlatformHealth(
      executiveScore,
      revenueScore
    );

  const risks =
    generatePlatformRisks(
      executiveScore,
      revenueScore
    );

  const opportunities =
    generatePlatformOpportunities(
      executiveScore,
      revenueScore
    );

  const forecast =
    generatePlatformForecast(
      mrr,
      clubs
    );

    const decisions =
  buildDecisionEngine({

    health,

    risks,

    opportunities,

    forecast,

  });

  return {

    health,

    risks,

    opportunities,

    forecast,

    decisions,

  };

}