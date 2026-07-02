export type AIAction = {
  priority: number;

  title: string;

  description: string;

  confidence: number;

  source: string;
};

export type AIContext = {

  executive: any;

  revenue: any;

  platform: any;

  prediction: any;

  learning: any;

  knowledge: any;

};

export type OrchestratorDashboard = {

  actions: AIAction[];

  context: AIContext;

};