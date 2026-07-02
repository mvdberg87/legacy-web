import type { AIAction } from "./types";

export function prioritizeActions(
  actions: AIAction[]
) {

  return actions.sort(

    (a, b) =>

      b.priority - a.priority

  );

}