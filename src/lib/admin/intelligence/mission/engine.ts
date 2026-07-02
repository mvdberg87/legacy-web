import { buildRevenueDashboard } from "../revenue/engine";
import { buildPlatformDashboard } from "../platform/engine";
import { buildBenchmarkDashboard } from "../benchmark/engine";
import { buildActionDashboard } from "../actions/engine";
import { buildAssistantDashboard } from "../assistant/engine";

export function buildMissionControl(

  executive: any,

  clubs: any[],

  advertisements: any[]

) {

  const revenue =
    buildRevenueDashboard(
      clubs,
      advertisements
    );

  const benchmark =
    buildBenchmarkDashboard(
      clubs
    );

  const platform =
    buildPlatformDashboard(

      executive.summary.intelligenceScore,

      revenue.health.score,

      revenue.metrics.mrr,

      clubs.length

    );

  const actions =
    buildActionDashboard(

      platform.decisions,

      [],

      revenue,

      benchmark,

      platform

    );

  const assistant =
    buildAssistantDashboard(

      platform,

      actions

    );

  return {

    executive,

    revenue,

    benchmark,

    platform,

    actions,

    assistant,

  };

}