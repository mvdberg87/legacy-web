export type PlatformHealth = {
  score: number;
  label: string;
  color: string;
};

export type PlatformRisk = {
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
};

export type PlatformOpportunity = {
  title: string;
  description: string;
  impact: string;
  confidence: number;
};

export type PlatformForecast = {
  mrrNextMonth: number;
  clubsNextMonth: number;
  revenueNextMonth: number;
};

export type PlatformDashboard =
  PlatformContext & {
    decisions: Decision[];
  };

export type Decision = {
  priority: 1 | 2 | 3 | 4 | 5;

  category:
    | "growth"
    | "revenue"
    | "risk"
    | "activation";

  title: string;

  description: string;

  impact: string;

  confidence: number;
};

export type PlatformContext = {
  health: PlatformHealth;
  risks: PlatformRisk[];
  opportunities: PlatformOpportunity[];
  forecast: PlatformForecast;
};