import type {
  ExecutiveBriefing,
  BriefingItem,
  Insight,
  Recommendation,
  ExecutiveAlert,
} from "./types";

type IntelligenceSummary = {
  summary: {
    intelligenceScore: number;
    totalClubs: number;
    averageHealth: number;
  };
};

export function generateExecutiveBriefing(
  intelligence: IntelligenceSummary,
  insights: Insight[],
  alerts: ExecutiveAlert[],
  recommendations: Recommendation[]
): ExecutiveBriefing {

  const items: BriefingItem[] = [];

  /*
   * 1. Belangrijkste alert
   */

  if (alerts.length > 0) {

    items.push({
      severity: alerts[0].severity,
      title: alerts[0].title,
      description: alerts[0].description,
    });

  }

  /*
   * 2. Belangrijkste inzicht
   */

  if (insights.length > 0) {

    items.push({
      severity: "info",
      title: insights[0].title,
      description: insights[0].finding,
    });

  }

  /*
   * 3. Belangrijkste aanbeveling
   */

  if (recommendations.length > 0) {

    items.push({
      severity: "success",
      title: "Aanbevolen actie",
      description: recommendations[0].title,
    });

  }

  /*
   * 4. Fallback
   */

  if (items.length === 0) {

    items.push({
      severity: "success",
      title: "Platform stabiel",
      description:
        "Er zijn momenteel geen bijzonderheden.",
    });

  }

  return {

    score:
      intelligence.summary.intelligenceScore,

    items,

  };

}