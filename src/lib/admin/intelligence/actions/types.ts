export type Action = {

  id: string;

  title: string;

  description: string;

  category:
    | "sales"
    | "revenue"
    | "marketing"
    | "operations"
    | "platform";

  priority: number;

  impact: number;

  effort: number;

  confidence: number;

  source: string;

};

export type ActionDashboard = {

  actions: Action[];

  highestPriority?: Action;

};