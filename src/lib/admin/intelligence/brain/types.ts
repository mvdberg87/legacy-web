export type BrainContext = {

  missionScore: number;

  platformHealth: number;

  revenueHealth: number;

  benchmarkScore: number;

  opportunities: number;

  actions: any[];

  actionCount: number;

  risks: number;

  confidence: number;

  topAction: any;

  strongestDiscovery: any;

  weakestMetric: string;

};

export type BrainDecision = {

  id: string;

  title: string;

  explanation: string;

  priority: number;

  confidence: number;

};

export type BrainDashboard = {

  decisions: BrainDecision[];

  briefing: string;

};