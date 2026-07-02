import { loadExecutiveData } from "./loadExecutiveData";

import { getExecutiveIntelligence } from "./engine";
import { generateAlerts } from "./alerts";
import { generateRecommendations } from "./recommendations";
import { generateInsights } from "./insights";
import { generateExecutiveBriefing } from "./briefing";
import { generateSponsorjobsIQ } from "./sponsorjobsIQ";
import { generateCorrelations } from "./correlations";
import { generateSuccessFactors } from "./successFactors";
import { buildPlatformDashboard } from "./platform/engine";
import { buildAssistantDashboard } from "./assistant/engine";
import { buildPredictionDashboard } from "./prediction/engine";
import { buildBenchmarkDashboard } from "./benchmark/engine";
import { buildActionDashboard } from "./actions/engine";

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

    const benchmark =
  buildBenchmarkDashboard(clubs);

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

    const platform =
  buildPlatformDashboard(
    intelligence.summary.intelligenceScore,
    90, // tijdelijke Revenue Score
    0,  // tijdelijke MRR
    clubs.length
  );

  const predictions =
  buildPredictionDashboard(
    clubs
  );

const actions =
  buildActionDashboard(
    platform.decisions
  );

const assistant =
  buildAssistantDashboard(
    platform,
    actions
  );

  return {

  executive: intelligence,

  benchmark,

  actions,

  platform,

  assistant,

  predictions,

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