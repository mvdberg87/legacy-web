export type Prediction = {
  clubId: string;

  clubName: string;

  probability: number;

  confidence: number;

  reason: string;
};

export type PredictionDashboard = {

  upgrades: Prediction[];

  churn: Prediction[];

  growth: Prediction[];

  advertisements: Prediction[];

};