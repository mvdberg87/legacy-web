import type { Action } from "./types";

export function buildPlatformActions(
  platform: any
) {

  return platform.decisions.map(

    (decision: any, index: number) => ({

      id:
        `platform-${index}`,

      title:
        decision.title,

      description:
        decision.description,

      category:
        decision.category,

      priority:
        decision.priority,

      impact: 75,

      effort: 30,

      confidence:
        decision.confidence,

      source:
        "Platform Engine",

    })

  );

}