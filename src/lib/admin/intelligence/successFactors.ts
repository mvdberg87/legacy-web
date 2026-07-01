import type { Correlation } from "./correlations";
import type { SuccessFactor } from "./types";

export function generateSuccessFactors(
  correlations: Correlation[]
): SuccessFactor[] {

  if (correlations.length === 0) {
    return [];
  }

  return correlations
    .slice(0, 5)
    .map((correlation) => ({

      title:
        `${correlation.metric} is een belangrijke succesfactor`,

      description:
        correlation.conclusion,

      recommendation:
        recommendationForMetric(
          correlation.metric
        ),

      confidence:
        calculateConfidence(
          correlation.difference
        ),

      impact:
        createImpactLabel(
          correlation.difference
        ),

    }));

}

/* ============================================================
   Helpers
============================================================ */

function recommendationForMetric(
  metric: string
): string {

  switch (metric) {

    case "Vacatures":
      return "Stimuleer verenigingen om minimaal vijf actieve vacatures te plaatsen.";

    case "Pageviews":
      return "Vergroot het bereik met social media en promotie.";

    case "Clicks":
      return "Optimaliseer vacatureteksten en call-to-actions.";

    case "Shares":
      return "Moedig verenigingen aan om vacatures actief te delen.";

    default:
      return "Blijf deze KPI actief monitoren.";

  }

}

function calculateConfidence(
  difference: number
): number {

  if (difference >= 100) return 98;

  if (difference >= 50) return 94;

  if (difference >= 25) return 90;

  if (difference >= 10) return 85;

  return 75;

}

function createImpactLabel(
  difference: number
): string {

  if (difference >= 100)
    return "Zeer hoge impact";

  if (difference >= 50)
    return "Hoge impact";

  if (difference >= 25)
    return "Gemiddelde impact";

  return "Lage impact";

}