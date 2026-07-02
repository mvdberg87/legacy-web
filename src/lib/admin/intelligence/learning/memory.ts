import type { LearningEvent } from "./types";

export function buildMemory(
  history: LearningEvent[]
) {

  return {

    events: history,

    total: history.length,

  };

}