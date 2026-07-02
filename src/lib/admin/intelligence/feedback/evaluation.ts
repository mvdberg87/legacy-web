import type {
  FeedbackEvaluation,
} from "./types";

export function evaluateResult(
  success: boolean
): FeedbackEvaluation {

  return {

    success,

    score: success ? 100 : 0,

    confidence: success ? 90 : 60,

  };

}