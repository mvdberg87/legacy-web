import type {
  PlatformContext,
  Decision,
} from "./types";

import type {
  PredictionDashboard,
} from "../prediction/types";

export function buildDecisionEngine(
  platform: PlatformContext,
  predictions?: PredictionDashboard
): Decision[] {

  const decisions: Decision[] = [];

  /*
   * Hoogste risico's
   */

  platform.risks.forEach((risk, index) => {

    decisions.push({

      priority:
        (index + 1) as 1 | 2 | 3 | 4 | 5,

      category: "risk",

      title: risk.title,

      description: risk.description,

      impact: "Risico beperken",

      confidence: 90,

    });

  });

  /*
   * Grootste kansen
   */

  platform.opportunities.forEach((opportunity) => {

    decisions.push({

      priority: 2,

      category: "growth",

      title: opportunity.title,

      description:
        opportunity.description,

      impact:
        opportunity.impact,

      confidence:
        opportunity.confidence,

    });

    if (predictions) {

  predictions.upgrades
    .slice(0, 3)
    .forEach((club) => {

      decisions.push({

        priority: 1,

        category: "revenue",

        title:
          `Bel ${club.clubName}`,

        description:
          `Upgradekans ${club.probability}%`,

        impact:
          "Extra MRR",

        confidence:
          club.confidence,

      });

    });

}

  });

  return decisions.sort(

    (a, b) =>

      a.priority - b.priority

  );

}