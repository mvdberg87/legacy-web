import type {
  Opportunity,
} from "./types";

export function rankOpportunities(
  opportunities: Opportunity[]
) {

  return [...opportunities].sort(

    (a, b) =>

      b.score - a.score

  );

}