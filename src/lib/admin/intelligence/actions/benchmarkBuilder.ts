import type { Action } from "./types";

export function buildBenchmarkActions(
  benchmark: any
) {

  const actions: Action[] = [];

  if (
    benchmark.ranking.length
  ) {

    actions.push({

      id: "benchmark",

      title:
        "Analyseer topclub",

      description:
        `Bestudeer ${benchmark.ranking[0].clubName}.`,

      category: "platform",

      priority: 3,

      impact: 60,

      effort: 25,

      confidence: 90,

      source: "Benchmark Engine",

    });

  }

  return actions;

}