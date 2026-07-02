import type {
  ActionDashboard,
} from "../actions/types";

export type AssistantPriority = {
  title: string;
  description: string;
  impact: string;
  confidence: number;
};

export type AssistantSummary = {
  title: string;
  description: string;
};

export type AssistantDashboard = {
  summary: AssistantSummary;

  priorities: AssistantPriority[];

  actions: ActionDashboard;
};