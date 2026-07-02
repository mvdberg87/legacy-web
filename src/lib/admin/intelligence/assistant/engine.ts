import { generateAssistantSummary } from "./summary";
import { generatePriorities } from "./priorities";

import type { PlatformDashboard } from "../platform/types";
import type { AssistantDashboard } from "./types";
import type { ActionDashboard } from "../actions/types";

export function buildAssistantDashboard(
  platform: PlatformDashboard,
  actions: ActionDashboard
): AssistantDashboard {

  return {

    summary:
      generateAssistantSummary(platform),

    priorities:
      generatePriorities(platform),

      actions,

  };

}