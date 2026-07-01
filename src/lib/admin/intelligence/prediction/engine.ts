import { predictUpgrades } from "./upgradePrediction";
import { predictChurn } from "./churnPrediction";
import { predictGrowth } from "./growthPrediction";
import { predictAdvertisements } from "./advertisementPrediction";

import type {
  PredictionDashboard,
} from "./types";

import type {
  UpgradeClub,
} from "./upgradePrediction";

export function buildPredictionDashboard(
  clubs: UpgradeClub[]
): PredictionDashboard {

  return {

    upgrades:
      predictUpgrades(clubs),

    churn:
      predictChurn(clubs),

    growth:
      predictGrowth(clubs),

    advertisements:
      predictAdvertisements(),

  };

}