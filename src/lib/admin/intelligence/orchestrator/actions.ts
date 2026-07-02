import type {
  AIContext,
  AIAction,
} from "./types";

export function buildActions(
  context: AIContext
): AIAction[] {

  const actions: AIAction[] = [];

  context.platform.decisions.forEach(
    (decision: any) => {

      actions.push({

        priority: 100 - decision.priority,

        title: decision.title,

        description:
          decision.description,

        confidence:
          decision.confidence,

        source:
          "Platform",

      });

    }
  );

  return actions;

}