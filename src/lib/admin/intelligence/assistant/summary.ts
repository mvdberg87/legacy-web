import type { PlatformDashboard } from "../platform/types";
import type { AssistantSummary } from "./types";

export function generateAssistantSummary(
  platform: PlatformDashboard
): AssistantSummary {

  return {

    title: "CEO Briefing",

    description:
      `Platform Health bedraagt ${platform.health.score}/100. ` +
      `Er zijn ${platform.opportunities.length} groeikansen en ` +
      `${platform.risks.length} risico's die aandacht vragen.`,

  };

}