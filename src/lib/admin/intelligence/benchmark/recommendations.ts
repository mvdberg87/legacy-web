import type {
  BenchmarkResult,
  BenchmarkRecommendation,
} from "./types";

export function generateBenchmarkRecommendations(
  benchmark: BenchmarkResult
): BenchmarkRecommendation[] {

  const recommendations: BenchmarkRecommendation[] = [];

  if (benchmark.percentile < 50) {

    recommendations.push({

      title:
        "Plaats meer vacatures",

      description:
        "Meer actieve vacatures verhogen doorgaans bereik en engagement.",

    });

  }

  if (benchmark.percentile > 90) {

    recommendations.push({

      title:
        "Gebruik deze club als voorbeeld",

      description:
        "Analyseer waarom deze club zo goed presteert.",

    });

  }

  return recommendations;

}