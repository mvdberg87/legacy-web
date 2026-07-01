import type { Prediction } from "./types";
import { buildSignals } from "./signals";
import { calculatePredictionScore } from "./scoring";

export type GrowthClub = {
  id: string;
  name: string;

  activeJobs: number;
  pageviews: number;
  totalClicks: number;
  totalShares: number;
};

export function predictGrowth(
  clubs: GrowthClub[]
): Prediction[] {

  return clubs
    .map((club) => {

      const signals =
  buildSignals(club);

const score =
  calculatePredictionScore(
    signals
  );

      return {

        clubId: club.id,

        clubName: club.name,

        probability: score,

        confidence: 91,

        reason:
          "Gebaseerd op groei in bereik en interactie.",

      };

    })

    .sort(
      (a, b) =>
        b.probability - a.probability
    );

}