import type { Action } from "./types";

export function buildDecisionActions(
  decisions: any[]
): Action[] {

  return decisions.map((decision, index) => ({

    id: `decision-${index}`,

    title: decision.title,

    description: decision.description,

    category: decision.category,

    priority: decision.priority,

    impact: 80,

    effort: 20,

    confidence: decision.confidence,

    source: "Decision Engine",

  }));

}