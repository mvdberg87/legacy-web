import { calculateROI } from "./roi";
import { calculateUrgency } from "./urgency";
import { normalizeConfidence } from "./confidence";
import { ScoringWeights } from "./weights";

import type {
  ActionScore,
} from "./types";

export function scoreAction(

  action: any

): ActionScore {

  const roi =
    calculateROI(

      action.impact,

      action.effort

    );

  const urgency =
    calculateUrgency(

      action.priority

    );

  const confidence =
    normalizeConfidence(

      action.confidence

    );

  const finalScore =

      roi *
      ScoringWeights.impact

    +

      confidence *
      ScoringWeights.confidence

    +

      urgency *
      ScoringWeights.urgency

    -

      action.effort *
      ScoringWeights.effort;

  return {

    roi,

    urgency,

    confidence,

    impact:
      action.impact,

    effort:
      action.effort,

    finalScore:
      Math.round(finalScore),

  };

}