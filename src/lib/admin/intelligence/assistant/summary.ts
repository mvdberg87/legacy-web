import type { PlatformDashboard } from "../platform/types";
import type { AssistantSummary } from "./types";

export function generateAssistantSummary(
  platform: PlatformDashboard
): AssistantSummary {

  return {

  greeting:
    "Goedemorgen Michiel 👋",

  platformStatus:
    "Het platform is gezond. Er zijn vandaag 3 nieuwe kansen.",

  recommendation:
    "Bel vandaag VV Naaldwijk. Dit is momenteel de kans met de hoogste verwachte impact.",

};

}