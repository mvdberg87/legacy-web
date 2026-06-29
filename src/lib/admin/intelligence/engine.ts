import {
  benchmarkHealth,
  benchmarkCTR,
  benchmarkPageviews,
  benchmarkActiveJobs,
  benchmarkShareRate,
  type BenchmarkClub,
} from "./benchmarks";

import {
  calculateHealthScore,
  calculateIntelligenceScore,
} from "./scores";

export function getExecutiveIntelligence(
  clubs: BenchmarkClub[]
) {

  const clubsWithHealth =
    clubs.map((club) => {

      const health =
        calculateHealthScore({

          activeJobs:
            club.activeJobs,

          pageviews:
            club.pageviews,

          totalClicks:
            club.totalClicks,

          totalShares:
            club.totalShares,

          isActive:
            club.activeJobs > 0,

        });

      return {

        ...club,

        healthScore:
          health.score,

      };

    });

  const healthBenchmark =
    benchmarkHealth(
      clubsWithHealth
    );

  return {

    summary: {

      totalClubs:
        clubs.length,

      averageHealth:
        healthBenchmark.average,

      intelligenceScore:
        calculateIntelligenceScore(
          clubsWithHealth.map(
            c => c.healthScore ?? 0
          )
        ),

    },

    benchmarks: {

      health:
        healthBenchmark,

      ctr:
        benchmarkCTR(clubs),

      pageviews:
        benchmarkPageviews(clubs),

      activeJobs:
        benchmarkActiveJobs(clubs),

      shareRate:
        benchmarkShareRate(clubs),

    },

  };

}