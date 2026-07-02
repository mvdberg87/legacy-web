import type { LearningEvent } from "./types";

export function calculateFeedback(
  history: LearningEvent[]
) {

  return history.map((event) => ({

    ...event,

    error:

      Math.abs(

        event.predictedValue -

        event.actualValue

      ),

  }));

}