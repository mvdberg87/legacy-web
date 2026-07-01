import type {
  PlatformOpportunity,
} from "./types";

export function generatePlatformOpportunities(
  executiveScore: number,
  revenueScore: number
): PlatformOpportunity[] {

  const opportunities: PlatformOpportunity[] = [];

  if (executiveScore < 80) {
    opportunities.push({
      title: "Meer actieve vacatures",
      description:
        "Meer vacatures verhogen bereik en engagement.",
      impact: "Hoog",
      confidence: 94,
    });
  }

  if (revenueScore < 80) {
    opportunities.push({
      title: "Meer upgrades realiseren",
      description:
        "Focus op clubs met veel activiteit maar een laag abonnement.",
      impact: "Zeer hoog",
      confidence: 91,
    });
  }

  return opportunities;
}