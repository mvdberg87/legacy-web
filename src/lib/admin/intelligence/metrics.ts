/**
 * ============================================================
 * Sponsorjobs Intelligence
 * Metric Registry
 * ------------------------------------------------------------
 * Alle KPI's binnen Sponsorjobs worden hier centraal gedefinieerd.
 *
 * Hierdoor gebruiken dashboards, tooltips, AI Insights,
 * rapportages en benchmarks altijd dezelfde definities.
 * ============================================================
 */

export type MetricCategory =
  | "Growth"
  | "Revenue"
  | "Customer Success"
  | "Marketplace"
  | "Engagement"
  | "Recruitment"
  | "Platform";

export type MetricDefinition = {
  key: string;

  title: string;

  short: string;

  description: string;

  category: MetricCategory;

  unit: "€" | "%" | "#" | "/100";

  icon: string;

  color:
    | "emerald"
    | "blue"
    | "amber"
    | "red"
    | "violet"
    | "cyan"
    | "gray";

  higherIsBetter: boolean;

  target?: number | null;
};

export const METRICS: Record<string, MetricDefinition> = {

  intelligenceScore: {
    key: "intelligenceScore",
    title: "Sponsorjobs Intelligence Score",
    short: "IQ",
    description:
      "De totale gezondheid van het Sponsorjobs-platform.",
    category: "Platform",
    unit: "/100",
    icon: "🧠",
    color: "violet",
    higherIsBetter: true,
    target: 85,
  },

  mrr: {
    key: "mrr",
    title: "Monthly Recurring Revenue",
    short: "MRR",
    description:
      "De totale terugkerende abonnementen per maand.",
    category: "Revenue",
    unit: "€",
    icon: "💰",
    color: "emerald",
    higherIsBetter: true,
  },

  arr: {
    key: "arr",
    title: "Annual Recurring Revenue",
    short: "ARR",
    description:
      "De verwachte jaarlijkse abonnementenomzet.",
    category: "Revenue",
    unit: "€",
    icon: "📈",
    color: "emerald",
    higherIsBetter: true,
  },

  nrr: {
    key: "nrr",
    title: "Net Revenue Retention",
    short: "NRR",
    description:
      "Meet hoeveel omzet behouden blijft inclusief upgrades.",
    category: "Revenue",
    unit: "%",
    icon: "📊",
    color: "blue",
    higherIsBetter: true,
    target: 100,
  },

  churn: {
    key: "churn",
    title: "Churn Rate",
    short: "Churn",
    description:
      "Percentage clubs dat opzegt.",
    category: "Growth",
    unit: "%",
    icon: "📉",
    color: "red",
    higherIsBetter: false,
  },

  healthScore: {
    key: "healthScore",
    title: "Club Health Score",
    short: "Health",
    description:
      "Meet hoe actief clubs Sponsorjobs gebruiken.",
    category: "Customer Success",
    unit: "/100",
    icon: "❤️",
    color: "emerald",
    higherIsBetter: true,
    target: 80,
  },

  ctr: {
    key: "ctr",
    title: "Click Through Rate",
    short: "CTR",
    description:
      "Percentage bezoekers dat op vacatures klikt.",
    category: "Engagement",
    unit: "%",
    icon: "🎯",
    color: "blue",
    higherIsBetter: true,
    target: 5,
  },

  shareRate: {
    key: "shareRate",
    title: "Share Rate",
    short: "Shares",
    description:
      "Percentage bezoekers dat vacatures deelt.",
    category: "Engagement",
    unit: "%",
    icon: "📢",
    color: "cyan",
    higherIsBetter: true,
  },

  activeJobs: {
    key: "activeJobs",
    title: "Actieve vacatures",
    short: "Vacatures",
    description:
      "Aantal actieve vacatures op het platform.",
    category: "Recruitment",
    unit: "#",
    icon: "💼",
    color: "amber",
    higherIsBetter: true,
  },

  pageviews: {
    key: "pageviews",
    title: "Pageviews",
    short: "Views",
    description:
      "Aantal bekeken vacaturepagina's.",
    category: "Engagement",
    unit: "#",
    icon: "👀",
    color: "cyan",
    higherIsBetter: true,
  },

  activeClubs: {
    key: "activeClubs",
    title: "Actieve clubs",
    short: "Clubs",
    description:
      "Aantal actieve verenigingen op Sponsorjobs.",
    category: "Growth",
    unit: "#",
    icon: "🏟️",
    color: "emerald",
    higherIsBetter: true,
  },

  trialConversion: {
    key: "trialConversion",
    title: "Trial Conversion",
    short: "Trial → Paid",
    description:
      "Percentage proefaccounts dat klant wordt.",
    category: "Growth",
    unit: "%",
    icon: "🚀",
    color: "violet",
    higherIsBetter: true,
  },

  advertisementRevenue: {
    key: "advertisementRevenue",
    title: "Advertentie omzet",
    short: "Ads",
    description:
      "Totale omzet uit advertenties.",
    category: "Marketplace",
    unit: "€",
    icon: "📢",
    color: "amber",
    higherIsBetter: true,
  },

  platformRevenue: {
    key: "platformRevenue",
    title: "Platform omzet",
    short: "Platform",
    description:
      "Omzet die naar Sponsuls gaat.",
    category: "Marketplace",
    unit: "€",
    icon: "🏦",
    color: "emerald",
    higherIsBetter: true,
  },

  clubRevenue: {
    key: "clubRevenue",
    title: "Club omzet",
    short: "Club",
    description:
      "Omzet die naar verenigingen gaat.",
    category: "Marketplace",
    unit: "€",
    icon: "🤝",
    color: "blue",
    higherIsBetter: true,
  },
};