import { prioritizeActions } from "./prioritizer";

import { buildDecisionActions } from "./decisionBuilder";
import { buildPredictionActions } from "./predictionBuilder";
import { buildRevenueActions } from "./revenueBuilder";
import { buildBenchmarkActions } from "./benchmarkBuilder";
import { buildPlatformActions } from "./platformBuilder";

import type {
  ActionDashboard,
} from "./types";

export function buildActionDashboard(
  decisions: any[],
  predictions: any[] = [],
  revenue?: any,
  benchmark?: any,
  platform?: any
): ActionDashboard {

  const actions = [

    ...buildDecisionActions(
      decisions
    ),

    ...buildPredictionActions(
      predictions
    ),

    ...(revenue
      ? buildRevenueActions(revenue)
      : []),

    ...(benchmark
      ? buildBenchmarkActions(benchmark)
      : []),

    ...(platform
      ? buildPlatformActions(platform)
      : []),

  ];

  const prioritized =
    prioritizeActions(actions);

  return {

    actions: prioritized,

    highestPriority:
      prioritized[0],

  };

}