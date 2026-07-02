export type KnowledgeFact = {
  id: string;

  category:
    | "club"
    | "advertisement"
    | "vacancy"
    | "prediction"
    | "platform";

  title: string;

  description: string;

  confidence: number;

  source: string;
};

export type KnowledgePattern = {
  title: string;

  description: string;

  confidence: number;

  impact: string;
};

export type KnowledgeBase = {

  facts: KnowledgeFact[];

  patterns: KnowledgePattern[];

};