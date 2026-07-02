import type { Reason } from "./types";

export function buildExplanation(
  reasons: Reason[]
) {

  if (!reasons.length) {

    return "Er zijn onvoldoende signalen.";

  }

  return reasons

    .map(

      (r) => r.title

    )

    .join(", ");

}