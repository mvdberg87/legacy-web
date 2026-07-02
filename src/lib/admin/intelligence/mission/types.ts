import type { RevenueDashboard } from "../revenue/engine";
import type { PlatformDashboard } from "../platform/types";
import type { BenchmarkDashboard } from "../benchmark/types";
import type { ActionDashboard } from "../actions/types";
import type { AssistantDashboard } from "../assistant/types";

export type MissionControlDashboard = {

  executive: any;

  revenue: RevenueDashboard;

  platform: PlatformDashboard;

  benchmark: BenchmarkDashboard;

  actions: ActionDashboard;

  assistant: AssistantDashboard;

};