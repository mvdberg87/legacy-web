import type { BenchmarkClub } from "./benchmarks";
import type { Insight } from "./types";

import {
  calculateCTR,
  calculateShareRate,
} from "./scores";

export function generateInsights(
  clubs: BenchmarkClub[]
): Insight[] {

  const insights: Insight[] = [];

  if (clubs.length === 0) {
    return insights;
  }

  const activeClubs =
    clubs.filter(c => c.activeJobs > 0);

  if (activeClubs.length === 0) {

    insights.push({

      title: "Platformactivatie",

      finding:
        "Er zijn nog geen actieve clubs op het platform.",

      confidence: 100,

      impact:
        "Geen bereik",

      recommendation:
        "Activeer eerst verenigingen voordat verdere optimalisatie plaatsvindt.",

    });

    return insights;
  }

  /*
   * Gemiddeld aantal vacatures
   */

  const avgJobs =
    activeClubs.reduce(
      (sum, c) => sum + c.activeJobs,
      0
    ) / activeClubs.length;

  insights.push({

    title:
      "Vacaturevolume",

    finding:
      `Actieve clubs hebben gemiddeld ${avgJobs.toFixed(1)} vacatures.`,

    confidence: 100,

    impact:
      "Platformbenchmark",

    recommendation:
      "Gebruik dit gemiddelde als minimale doelstelling voor nieuwe clubs.",

  });

  /*
   * Gemiddelde CTR
   */

  const avgCTR =
    activeClubs.reduce(
      (sum, c) =>
        sum +
        calculateCTR(
          c.totalClicks,
          c.pageviews
        ),
      0
    ) / activeClubs.length;

  insights.push({

    title:
      "Gemiddelde CTR",

    finding:
      `De gemiddelde CTR bedraagt ${avgCTR.toFixed(1)}%.`,

    confidence: 100,

    impact:
      "Engagement",

    recommendation:
      "Vergelijk clubs onder deze benchmark en onderzoek de oorzaak.",

  });

  /*
   * Gemiddelde Share Rate
   */

  const avgShareRate =
    activeClubs.reduce(
      (sum, c) =>
        sum +
        calculateShareRate(
          c.totalShares,
          c.pageviews
        ),
      0
    ) / activeClubs.length;

  insights.push({

    title:
      "Gemiddelde Share Rate",

    finding:
      `De gemiddelde share rate bedraagt ${avgShareRate.toFixed(1)}%.`,

    confidence: 100,

    impact:
      "Bereik",

    recommendation:
      "Stimuleer clubs om vacatures actief via social media te delen.",

  });

  /*
   * Clubs zonder vacatures
   */

  const inactive =
    clubs.filter(
      c => c.activeJobs === 0
    );

  if (inactive.length > 0) {

    insights.push({

      title:
        "Activatiekans",

      finding:
        `${inactive.length} clubs hebben momenteel geen actieve vacatures.`,

      confidence: 100,

      impact:
        "Hoog",

      recommendation:
        "Neem contact op met deze clubs en help hen bij het plaatsen van de eerste vacatures.",

    });

  }

  return insights;

}