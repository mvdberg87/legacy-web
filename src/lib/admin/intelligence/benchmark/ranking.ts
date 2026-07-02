import { calculateBenchmarkScore } from "./score";

import { determineGroup } from "./groups";

export function rankClubs(
  clubs: any[]
) {

  return clubs

    .map((club) => ({

  ...club,

  group:
    determineGroup(club),

  score:
    calculateBenchmarkScore(
      club),

}))

    .sort(

      (a, b) =>

        b.score - a.score

    );

}