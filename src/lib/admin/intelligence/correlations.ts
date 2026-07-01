import type { BenchmarkClub } from "./benchmarks";

export type Correlation = {

  metric: string;

  averageTop20: number;

  averageBottom20: number;

  difference: number;

  conclusion: string;

};

export function generateCorrelations(
  clubs: BenchmarkClub[]
): Correlation[] {

  if (clubs.length < 2) {
    return [];
  }

  const correlations: Correlation[] = [];

  correlations.push(
    compareMetric(
      clubs,
      c => c.activeJobs,
      "Vacatures"
    )
  );

  correlations.push(
    compareMetric(
      clubs,
      c => c.pageviews,
      "Pageviews"
    )
  );

  correlations.push(
    compareMetric(
      clubs,
      c => c.totalClicks,
      "Clicks"
    )
  );

  correlations.push(
    compareMetric(
      clubs,
      c => c.totalShares,
      "Shares"
    )
  );

  return correlations.sort(
    (a, b) => b.difference - a.difference
  );

}

function compareMetric(
  clubs: BenchmarkClub[],
  selector: (club: BenchmarkClub) => number,
  metric: string
): Correlation {

  const sorted =
    [...clubs].sort(
      (a, b) =>
        selector(b) - selector(a)
    );

  const size =
    Math.max(
      1,
      Math.ceil(sorted.length * 0.2)
    );

  const top =
    sorted.slice(0, size);

  const bottom =
    sorted.slice(-size);

  const avgTop =
    average(top.map(selector));

  const avgBottom =
    average(bottom.map(selector));

  const difference =
    Number(
      (avgTop - avgBottom).toFixed(1)
    );

  return {

    metric,

    averageTop20: avgTop,

    averageBottom20: avgBottom,

    difference,

    conclusion:
      `${metric} verschilt gemiddeld ${difference} tussen de top- en onderkant van het platform.`,

  };

}

function average(
  values: number[]
): number {

  if (values.length === 0) {
    return 0;
  }

  return Number(
    (
      values.reduce(
        (a, b) => a + b,
        0
      ) / values.length
    ).toFixed(1)
  );

}