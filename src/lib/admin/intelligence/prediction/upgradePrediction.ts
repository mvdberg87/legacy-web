import type { Prediction } from "./types";

import { buildSignals } from "./signals";
import { calculatePredictionScore } from "./scoring";

export type UpgradeClub = {

  id: string;

  name: string;

  activeJobs: number;

  pageviews: number;

  totalClicks: number;

  totalShares: number;

};

export function predictUpgrades(
  clubs: UpgradeClub[]
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

  probability:
    Math.round(score),

  confidence: 90,

  reason:
    "Gebaseerd op gewogen activiteit, bereik en engagement.",

};

    })

    .sort(
      (a, b) =>
        b.probability - a.probability
    );

}