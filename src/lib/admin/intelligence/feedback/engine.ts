import { buildHistory } from "./history";
import { buildMemory } from "./memory";
import { evaluateResult } from "./evaluation";

import type {
  FeedbackDashboard,
  FeedbackEvent,
} from "./types";

export function buildFeedbackDashboard(
  events: FeedbackEvent[]
): FeedbackDashboard {

  const history =
    buildHistory(events);

  buildMemory(history);

  const evaluations =
    history.map(() =>
      evaluateResult(true)
    );

  return {

    events: history,

    evaluations,

  };

}