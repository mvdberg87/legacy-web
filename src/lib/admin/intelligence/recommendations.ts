import {
  calculateHealthScore,
  calculateGrowthScore,
  calculateOpportunityScore,
} from "./scores";

import type { BenchmarkClub } from "./benchmarks";

export type Recommendation = {
  priority: "critical" | "high" | "medium" | "low";

  category:
    | "growth"
    | "revenue"
    | "activation"
    | "retention"
    | "platform";

  title: string;

  description: string;

  impact: string;
};

export function generateRecommendations(
  clubs: BenchmarkClub[]
): Recommendation[] {

  const recommendations: Recommendation[] = [];

  clubs.forEach((club) => {

    const health =
      calculateHealthScore({

        activeJobs: club.activeJobs,

        pageviews: club.pageviews,

        totalClicks: club.totalClicks,

        totalShares: club.totalShares,

        isActive: club.activeJobs > 0,

      });

    const growth =
      calculateGrowthScore({

        activeJobs: club.activeJobs,

        pageviews: club.pageviews,

        totalClicks: club.totalClicks,

        totalShares: club.totalShares,

      });

    const opportunity =
      calculateOpportunityScore({

        activeJobs: club.activeJobs,

        pageviews: club.pageviews,

        totalClicks: club.totalClicks,

        totalShares: club.totalShares,

      });

    if (club.activeJobs === 0) {

      recommendations.push({

        priority: "critical",

        category: "activation",

        title:
          `${club.name} heeft geen vacatures`,

        description:
          "Deze club haalt momenteel vrijwel geen waarde uit Sponsorjobs.",

        impact:
          "Nieuwe vacatures kunnen direct meer bereik opleveren.",

      });

    }

    if (opportunity.score >= 80) {

      recommendations.push({

        priority: "high",

        category: "growth",

        title:
          `${club.name} heeft hoge groeipotentie`,

        description:
          "Deze club presteert relatief goed, maar benut het platform nog onvoldoende.",

        impact:
          "Meer vacatures kunnen de prestaties aanzienlijk verhogen.",

      });

    }

    if (growth.score >= 80) {

      recommendations.push({

        priority: "medium",

        category: "revenue",

        title:
          `${club.name} is kandidaat voor een upgrade`,

        description:
          "De prestaties liggen boven de benchmark van vergelijkbare clubs.",

        impact:
          "Kans op extra MRR.",

      });

    }

    if (health.score < 40) {

      recommendations.push({

        priority: "high",

        category: "retention",

        title:
          `${club.name} heeft aandacht nodig`,

        description:
          "De algemene gezondheid van deze club ligt onder het platformgemiddelde.",

        impact:
          "Actieve begeleiding verkleint churn-risico.",

      });

    }

  });

  return recommendations;
}