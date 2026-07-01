import type { Insight } from "./types";

export function generateSponsorjobsIQ(
  insights: Insight[]
): Insight[] {

  const iq: Insight[] = [];

  /*
   * Gebruik de belangrijkste inzichten
   */

  insights.forEach((insight) => {

    iq.push({

      title:
        insight.title,

      finding:
        insight.finding,

      confidence:
        insight.confidence,

      impact:
        insight.impact,

      recommendation:
        insight.recommendation,

    });

  });

  /*
   * Nog niets gevonden?
   */

  if (iq.length === 0) {

    iq.push({

      title:
        "Platformanalyse",

      finding:
        "Er zijn momenteel onvoldoende gegevens beschikbaar om trends te ontdekken.",

      confidence:
        100,

      impact:
        "Geen",

      recommendation:
        "Verzamel meer platformdata.",

    });

  }

  /*
   * Sorteer op confidence
   */

  iq.sort(
    (a, b) =>
      b.confidence - a.confidence
  );

  return iq;

}