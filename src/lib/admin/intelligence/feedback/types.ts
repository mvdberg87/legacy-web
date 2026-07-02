export type FeedbackEvent = {

  id: string;

  timestamp: Date;

  source:
    | "prediction"
    | "action"
    | "assistant"
    | "manual";

  event: string;

  metadata: Record<string, any>;

};

export type FeedbackEvaluation = {

  success: boolean;

  score: number;

  confidence: number;

};

export type FeedbackDashboard = {

  events: FeedbackEvent[];

  evaluations: FeedbackEvaluation[];

};