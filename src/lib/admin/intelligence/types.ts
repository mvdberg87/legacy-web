export type ExecutiveClub = {
  id: string;
  slug: string;
  name: string;

  active_package: string | null;
  subscription_status: string | null;

  status: string | null;

  active_jobs: number;

  total_clicks: number;

  total_shares: number;

  pageviews: number;
};

export type ExecutiveSubscription = {
  id: string;

  amount: number;

  status: string;

  created_at: string;
};

export type ExecutiveAdvertisement = {
  id: string;

  club_name: string;

  amount: number;

  club_amount: number;

  platform_amount: number;
};

export type ExecutiveData = {

  clubs: ExecutiveClub[];

  subscriptions: ExecutiveSubscription[];

  advertisements: ExecutiveAdvertisement[];

};

/* ============================================================
   Executive Intelligence
============================================================ */

export type Severity =
  | "success"
  | "warning"
  | "info"
  | "critical";

  /* ============================================================
   Alerts
============================================================ */

export type ExecutiveAlert = {
  severity: Severity;

  category: Category;

  title: string;

  description: string;

  action: string;

  confidence: number;
};

export type Priority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type Category =
  | "growth"
  | "revenue"
  | "activation"
  | "retention"
  | "platform";

/* ============================================================
   Executive Briefing
============================================================ */

export type BriefingItem = {
  severity: Severity;
  title: string;
  description: string;
};

export type ExecutiveBriefing = {
  score: number;
  items: BriefingItem[];
};

/* ============================================================
   Recommendations
============================================================ */

export type Recommendation = {
  priority: Priority;
  category: Category;

  title: string;
  description: string;
  impact: string;
};

/* ============================================================
   Insights
============================================================ */

export type Insight = {
  title: string;
  finding: string;
  confidence: number;
  impact: string;
  recommendation: string;
};

/* ============================================================
   Success Factors
============================================================ */

export type SuccessFactor = {
  title: string;
  description: string;
  recommendation: string;
  confidence: number;
  impact: string;
};

/* ============================================================
   Executive Dashboard
============================================================ */

import type { Correlation } from "./correlations";

export type ExecutiveDashboardData = {

  executive: any;

  alerts: ExecutiveAlert[];

  briefing: ExecutiveBriefing;

  recommendations: Recommendation[];

  insights: Insight[];

  sponsorjobsIQ: Insight[];

  successFactors: SuccessFactor[];

  raw: ExecutiveData;

  correlations: Correlation[];

};