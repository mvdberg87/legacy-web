import { buildRevenueDashboard } from "../revenue/engine";
import { buildPlatformDashboard } from "../platform/engine";
import { buildBenchmarkDashboard } from "../benchmark/engine";
import { buildActionDashboard } from "../actions/engine";
import { buildAssistantDashboard } from "../assistant/engine";

import type { MissionControlDashboard } from "./types";
import { buildDiscoveryDashboard }
from "../discovery/engine";

import { loadMissionData } from "@/lib/admin/data/loadMissionData";
import { buildExecutiveDashboard } from "../buildExecutiveDashboard";
import { buildTimeline }
from "../timeline/engine";

export async function buildMissionControl(): Promise<MissionControlDashboard> {

const [
  executiveDashboard,
  missionData,
] = await Promise.all([

  buildExecutiveDashboard(),

  loadMissionData(),

]);

const clubs = missionData.clubs;

const advertisements =
  missionData.advertisements;

  const executiveData =
  executiveDashboard;

  const revenue =
    buildRevenueDashboard(
      clubs,
      advertisements
    );

  const benchmark =
    buildBenchmarkDashboard(
      clubs
    );

    const discovery =
  buildDiscoveryDashboard(clubs);

  const platform =
    buildPlatformDashboard(

  executiveData.executive.summary.intelligenceScore,

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

    platform,

    discovery

  );

  const assistant =
    buildAssistantDashboard(
      platform,
      actions
    );

    const timeline =
  buildTimeline();

  return {

    executive: executiveData,

    revenue,

    benchmark,

    discovery,

    platform,

    actions,

    assistant,

    timeline,

  };

}