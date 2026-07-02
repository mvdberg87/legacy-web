import type { Action } from "./types";

export function buildDiscoveryActions(
  discovery: any
): Action[] {

  if (!discovery) {
    return [];
  }

  return discovery.opportunities.map(
    (opportunity: any) => ({

      id: `discovery-${opportunity.id}`,

      title: opportunity.title,

      description: opportunity.description,

      category: "sales",

      priority: 2,

      impact: opportunity.score,

      effort: 20,

      confidence: opportunity.confidence,

      source: "Discovery Engine",

    })
  );

}