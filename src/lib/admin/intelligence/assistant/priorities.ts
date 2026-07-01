import type { PlatformDashboard } from "../platform/types";
import type { AssistantPriority } from "./types";

export function generatePriorities(
  platform: PlatformDashboard
): AssistantPriority[] {

  return platform.decisions.map((decision) => ({

    title: decision.title,

    description: decision.description,

    impact: decision.impact,

    confidence: decision.confidence,

  }));

}