export type LearningEvent = {
  id: string;

  clubId: string;

  type:
    | "upgrade"
    | "churn"
    | "growth"
    | "advertisement";

  predictedValue: number;

  actualValue: number;

  confidence: number;

  createdAt: string;
};

export type LearningSummary = {
  accuracy: number;

  totalEvents: number;

  lastTraining: string | null;
};