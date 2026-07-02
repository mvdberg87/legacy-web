export type DiscoverySignal = {

  name: string;

  value: number;

};

export type Opportunity = {

  id: string;

  title: string;

  description: string;

  score: number;

  confidence: number;

  estimatedRevenue: number;

};

export type DiscoveryDashboard = {

  opportunities: Opportunity[];

};