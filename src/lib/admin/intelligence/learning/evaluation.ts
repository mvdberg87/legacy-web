import type { LearningEvent } from "./types";

export function evaluateLearning(
  history: LearningEvent[]
) {

  if (!history.length) {

    return {

      accuracy: 0,

      totalEvents: 0,

    };

  }

  const error = history.reduce(

    (sum, event) =>

      sum +

      Math.abs(

        event.predictedValue -

        event.actualValue

      ),

    0

  );

  return {

    accuracy:

      Math.max(

        0,

        100 -

        error / history.length

      ),

    totalEvents:

      history.length,

  };

}