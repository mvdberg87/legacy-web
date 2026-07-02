import { buildSignals } from "./signals";
import { detectPatterns } from "./patterns";
import { generateOpportunities } from "./opportunities";
import { rankOpportunities } from "./ranking";

import type {
  DiscoveryDashboard,
} from "./types";

export function buildDiscoveryDashboard(
  clubs: any[]
): DiscoveryDashboard {

  const opportunities = clubs.flatMap(

    (club) => {

      const signals =
        buildSignals(club);

      const patterns =
        detectPatterns(signals);

      return generateOpportunities(
        patterns
      );

    }

  );

  return {

    opportunities:
      rankOpportunities(
        opportunities
      ),

  };

}