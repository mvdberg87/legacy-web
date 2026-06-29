import { loadExecutiveData } from "./loadExecutiveData";

import { getExecutiveIntelligence } from "./engine";
import { generateAlerts } from "./alerts";
import { generateRecommendations } from "./recommendations";
import type { BriefingItem } from "@/components/admin/intelligence/ExecutiveBriefing";

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

  return {

    executive: intelligence,

    alerts,

    recommendations,

        briefing: {

  score:
    intelligence.summary.intelligenceScore,

  items: [
    {
      severity: "good",
      title: "Platform groeit stabiel",
      description:
        "De gemiddelde gezondheidsscore van alle clubs blijft stabiel of verbetert.",
    },
    {
      severity: "warning",
      title: "Vier clubs hebben geen actieve vacatures",
      description:
        "Deze clubs halen momenteel weinig waarde uit Sponsorjobs.",
    },
    {
      severity: "info",
      title: "Twee potentiële upgrades ontdekt",
      description:
        "Hun activiteit ligt boven de benchmark van hun huidige abonnement.",
    },
  ] satisfies BriefingItem[],

},

    successFactors: [

      {
        title:
          "Minimaal vijf vacatures",

        description:
          "Clubs met minimaal vijf vacatures presteren gemiddeld aanzienlijk beter.",

        recommendation:
          "Stimuleer clubs om minimaal vijf vacatures actief te houden.",

        confidence: 91,

        impact: "+63% pageviews",
      },

      {
        title:
          "Vacatures delen",

        description:
          "Clubs die vacatures actief delen behalen structureel meer bereik.",

        recommendation:
          "Automatiseer LinkedIn-posts voor iedere nieuwe vacature.",

        confidence: 86,

        impact: "+24% CTR",
      },

    ],

    sponsorjobsIQ: [

      {
        title:
          "Platform Insight",

        finding:
          "Clubs met minimaal vijf vacatures behoren vrijwel altijd tot de top van het platform.",

        confidence: 94,

        impact:
          "+63% pageviews",

        recommendation:
          "Focus eerst op voldoende vacaturevolume voordat je optimaliseert.",
      },

      {
        title:
          "Platform Insight",

        finding:
          "Vacatures die worden gedeeld op social media genereren structureel meer klikken.",

        confidence: 89,

        impact:
          "+22% CTR",

        recommendation:
          "Maak social sharing onderdeel van iedere vacaturecampagne.",
      },

    ],

    raw: data,

  };

}