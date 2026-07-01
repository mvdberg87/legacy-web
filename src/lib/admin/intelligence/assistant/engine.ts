import { generateAssistantSummary } from "./summary";
import { generatePriorities } from "./priorities";

import type { PlatformDashboard } from "../platform/types";
import type { AssistantDashboard } from "./types";

export function buildAssistantDashboard(
  platform: PlatformDashboard
): AssistantDashboard {

  return {

    summary:
      generateAssistantSummary(platform),

    priorities:
      generatePriorities(platform),

  };

}