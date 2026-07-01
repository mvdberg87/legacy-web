import type { Prediction } from "./types";
import { buildSignals } from "./signals";
import { calculatePredictionScore } from "./scoring";

export type ChurnClub = {
  id: string;
  name: string;

  activeJobs: number;
  pageviews: number;
  totalClicks: number;
  totalShares: number;
};

export function predictChurn(
  clubs: ChurnClub[]
): Prediction[] {

  return clubs
    .map((club) => {

      const signals =
  buildSignals(club);

const risk =
  100 -
  calculatePredictionScore(
    signals
  );

      return {

        clubId: club.id,

        clubName: club.name,

        probability: risk,

        confidence: 88,

        reason:
          "Gebaseerd op lage activiteit en engagement.",

      };

    })

    .sort(
      (a, b) =>
        b.probability - a.probability
    );

}