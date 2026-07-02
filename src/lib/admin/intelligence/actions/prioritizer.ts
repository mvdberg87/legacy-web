import type { Action } from "./types";

export function prioritizeActions(
  actions: Action[]
) {

  return actions.sort(

    (a, b) =>

      (
        b.impact *
        b.confidence
      ) -

      (
        a.impact *
        a.confidence
      )

  );

}