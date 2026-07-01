import type {
  PlatformRisk,
} from "./types";

export function generatePlatformRisks(
  executiveScore: number,
  revenueScore: number
): PlatformRisk[] {

  const risks: PlatformRisk[] = [];

  if (executiveScore < 60) {
    risks.push({
      severity: "high",
      title: "Platformactiviteit daalt",
      description:
        "Meerdere clubs laten weinig activiteit zien.",
    });
  }

  if (revenueScore < 60) {
    risks.push({
      severity: "high",
      title: "Omzetgroei blijft achter",
      description:
        "De commerciële groei blijft onder verwachting.",
    });
  }

  return risks;
}