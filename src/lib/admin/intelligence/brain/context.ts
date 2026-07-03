import type {
  BrainContext,
} from "./types";

export function buildBrainContext(
  mission: any
): BrainContext {

  const opportunities =
    mission.discovery?.opportunities ?? [];

  const actions =
    mission.actions?.actions ?? [];

  const topAction =
    mission.actions?.highestPriority ?? null;

  return {

    missionScore:
      mission.platform.health.score,

    platformHealth:
      mission.platform.health.score,

    revenueHealth:
      mission.revenue.health.score,

    benchmarkScore:
      mission.benchmark.ranking.length,

    opportunities:
      opportunities.length,

    actions,

actionCount:
  actions.length,

    risks:
      actions.filter(
        (a:any)=>a.priority==="high"
      ).length,

    confidence: 95,

    topAction,

    strongestDiscovery:
      opportunities[0] ?? null,

    weakestMetric:
      mission.platform.health.label,

  };

}