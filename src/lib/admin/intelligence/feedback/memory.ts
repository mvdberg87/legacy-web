import type {
  FeedbackEvent,
} from "./types";

export function buildMemory(
  history: FeedbackEvent[]
) {

  return {

    totalEvents:
      history.length,

    lastEvent:
      history[0] ?? null,

  };

}