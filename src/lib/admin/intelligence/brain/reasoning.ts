import type {
  BrainDecision,
  BrainContext,
} from "./types";

export function buildReasoning(
  context: BrainContext
): BrainDecision[] {

  const decisions: BrainDecision[] = [];

  if (context.topAction) {

    decisions.push({

      id: context.topAction.id,

      title: context.topAction.title,

      explanation:
        `Deze actie heeft momenteel de hoogste strategische waarde. Er zijn ${context.opportunities} commerciële kansen ontdekt en de platformscore bedraagt ${context.platformHealth}.`,

      priority: 1,

      confidence: context.confidence,

    });

  }

  return decisions;

}