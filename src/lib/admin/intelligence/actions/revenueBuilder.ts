import type { Action } from "./types";

export function buildRevenueActions(
  revenue: any
): Action[] {

  const actions: Action[] = [];

  if (revenue.metrics.churnRate > 5) {

    actions.push({

      id: "churn",

      title:
        "Controleer churn",

      description:
        "Het churnpercentage loopt op.",

      category: "revenue",

      priority: 1,

      impact: 90,

      effort: 30,

      confidence: 92,

      source: "Revenue Engine",

    });

  }

  return actions;

}