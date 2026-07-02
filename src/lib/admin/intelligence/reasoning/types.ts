export type Reason = {

  title: string;

  description: string;

  weight: number;

};

export type Reasoning = {

  score: number;

  confidence: number;

  reasons: Reason[];

  explanation: string;

};