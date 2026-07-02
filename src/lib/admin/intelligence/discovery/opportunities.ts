import type {
  Opportunity,
} from "./types";

export function generateOpportunities(
  patterns: any[]
): Opportunity[] {

  return patterns.map(

    (pattern, index) => ({

      id: `opportunity-${index}`,

      title:
        `${pattern.name} groeit sterk`,

      description:
        `${pattern.name} laat opvallende groei zien.`,

      score: 80,

      confidence: 90,

      estimatedRevenue: 250,

    })

  );

}