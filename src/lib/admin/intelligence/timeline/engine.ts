import { buildTimelineEvents } from "./events";

import type {
  TimelineDashboard,
} from "./types";

export function buildTimeline(): TimelineDashboard {

  return {

    events:
      buildTimelineEvents(),

  };

}