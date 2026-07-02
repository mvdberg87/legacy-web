import type {
  FeedbackEvent,
} from "./types";

export function createEvent(
  source: FeedbackEvent["source"],
  event: string,
  metadata: Record<string, any>
): FeedbackEvent {

  return {

    id: crypto.randomUUID(),

    timestamp: new Date(),

    source,

    event,

    metadata,

  };

}