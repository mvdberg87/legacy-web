import { calculatePercentile } from "./percentile";

export function buildBenchmarkResults(
  ranking: any[]
) {

  return ranking.map(

    (club, index) => ({

      clubId: club.id,

      clubName: club.name,

      group: club.group,

      score: club.score,

      rank: index + 1,

      totalClubs:
        ranking.length,

      percentile:
        calculatePercentile(

          index + 1,

          ranking.length

        ),

    })

  );

}