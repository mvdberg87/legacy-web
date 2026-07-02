import { scoreAction }
from "../scoring/engine";

import type {
  Action,
} from "./types";

export function prioritizeActions(
  actions: Action[]
) {

  return [...actions]

    .map(action => ({

      ...action,

      scoring:
        scoreAction(action),

    }))

    .sort(

      (a, b) =>

        b.scoring.finalScore -

        a.scoring.finalScore

    );

}