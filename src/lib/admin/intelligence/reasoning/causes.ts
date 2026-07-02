import type { Reason } from "./types";

export function detectCauses(
  signals: Record<string, number>
): Reason[] {

  const reasons: Reason[] = [];

  Object.entries(signals).forEach(

    ([name, value]) => {

      if (value > 70) {

        reasons.push({

          title: name,

          description:
            `${name} draagt sterk bij aan de score.`,

          weight: value,

        });

      }

    }

  );

  return reasons;

}