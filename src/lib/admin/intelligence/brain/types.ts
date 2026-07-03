export type BrainContext = {

  executive: any;

  revenue: any;

  benchmark: any;

  discovery: any;

  platform: any;

  actions: any;

  assistant: any;

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