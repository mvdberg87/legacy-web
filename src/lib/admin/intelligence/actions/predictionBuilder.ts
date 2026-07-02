import type { Action } from "./types";

export function buildPredictionActions(
  predictions: any[]
): Action[] {

  return predictions.map((prediction, index) => ({

    id: `prediction-${index}`,

    title:
      `Neem contact op met ${prediction.clubName}`,

    description:
      `${prediction.probability}% kans op upgrade.`,

    category: "sales",

    priority: 1,

    impact: prediction.probability,

    effort: 20,

    confidence: prediction.confidence,

    source: "Prediction Engine",

  }));

}