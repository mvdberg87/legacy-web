import type {
  BrainContext,
} from "./types";

export function buildBrainContext(
  mission: any
): BrainContext {

  return {

    executive:
      mission.executive,

    revenue:
      mission.revenue,

    benchmark:
      mission.benchmark,

    discovery:
      mission.discovery,

    platform:
      mission.platform,

    actions:
      mission.actions,

    assistant:
      mission.assistant,

  };

}