import { detectCauses } from "./causes";
import { calculateConfidence } from "./confidence";
import { buildExplanation } from "./explanations";

import type { Reasoning } from "./types";

export function buildReasoning(
  signals: Record<string, number>
): Reasoning {

  const reasons =
    detectCauses(signals);

  return {

    score:
      reasons.reduce(

        (sum, r) =>

          sum + r.weight,

        0

      ),

    confidence:
      calculateConfidence(
        reasons.length
      ),

    reasons,

    explanation:
      buildExplanation(
        reasons
      ),

  };

}