import type { PredictionSignals } from "./signals";
import { PredictionWeights } from "./weights";

export function normalizeScore(
  value: number,
  max: number
) {
  return Math.min(
    100,
    Math.round((value / max) * 100)
  );
}

export function calculatePredictionScore(
  signals: PredictionSignals
): number {

  const score =

      signals.vacancySignal *
      PredictionWeights.vacancySignal

    + signals.trafficSignal *
      PredictionWeights.trafficSignal

    + signals.clickSignal *
      PredictionWeights.clickSignal

    + signals.shareSignal *
      PredictionWeights.shareSignal;

  return Math.round(
    Math.min(100, score)
  );

}