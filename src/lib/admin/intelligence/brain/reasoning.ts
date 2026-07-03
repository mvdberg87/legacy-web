import type {
  BrainDecision,
} from "./types";

export function buildReasoning(
  actions:any[]
): BrainDecision[] {

  return actions.map(

    action=>({

      id: action.id,

      title: action.title,

      explanation:

      `Deze actie heeft een ROI-score van ${action.scoring.finalScore} en is daarom één van de belangrijkste acties.`,

      priority:
        action.priority,

      confidence:
        action.confidence,

    })

  );

}