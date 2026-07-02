import type {
  FeedbackEvent,
} from "./types";

export function buildHistory(
  events: FeedbackEvent[]
): FeedbackEvent[] {

  return [...events].sort(

    (a, b) =>

      b.timestamp.getTime() -

      a.timestamp.getTime()

  );

}