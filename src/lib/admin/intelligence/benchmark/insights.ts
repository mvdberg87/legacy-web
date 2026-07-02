import type {
  BenchmarkResult,
  BenchmarkInsight,
} from "./types";

export function generateBenchmarkInsights(
  benchmark: BenchmarkResult
): BenchmarkInsight[] {

  const insights: BenchmarkInsight[] = [];

  if (benchmark.percentile >= 90) {

    insights.push({

      title: "Top performer",

      description:
        "Deze club behoort tot de beste 10% van het platform.",

      priority: 1,

    });

  }

  if (benchmark.percentile < 40) {

    insights.push({

      title: "Groeipotentieel",

      description:
        "Deze club presteert onder het platformgemiddelde.",

      priority: 2,

    });

  }

  return insights;

}