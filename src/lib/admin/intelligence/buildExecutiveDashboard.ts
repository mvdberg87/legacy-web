import { loadExecutiveData } from "./loadExecutiveData";

import { getExecutiveIntelligence } from "./engine";
import { generateAlerts } from "./alerts";
import { generateRecommendations } from "./recommendations";
import { generateInsights } from "./insights";
import { generateExecutiveBriefing } from "./briefing";
import { generateSponsorjobsIQ } from "./sponsorjobsIQ";
import { generateCorrelations } from "./correlations";
import { generateSuccessFactors } from "./successFactors";

export async function buildExecutiveDashboard() {

  const data =
    await loadExecutiveData();

  const clubs =
    data.clubs.map((club) => ({

      id: club.id,

      name: club.name,

      activeJobs:
        club.active_jobs,

      pageviews:
        club.pageviews,

      totalClicks:
        club.total_clicks,

      totalShares:
        club.total_shares,

    }));

  const intelligence =
    getExecutiveIntelligence(clubs);

  const alerts =
    generateAlerts(clubs);

    const recommendations =
  generateRecommendations(clubs);

  const insights =
  generateInsights(clubs);

  const correlations =
  generateCorrelations(clubs);

const successFactors =
  generateSuccessFactors(
    correlations
  );

  const briefing =
  generateExecutiveBriefing(
    intelligence,
    insights,
    alerts,
    recommendations
  );

    const sponsorjobsIQ =
    generateSponsorjobsIQ(
        insights
    );

  return {

  executive: intelligence,

  alerts,

  insights,

  correlations,

  recommendations,

  briefing,

  sponsorjobsIQ,

  successFactors,

  raw: data,

};

}