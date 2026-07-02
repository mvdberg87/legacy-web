import type {
  KnowledgeBase,
} from "./types";

export function generateKnowledgeInsights(
  knowledge: KnowledgeBase
) {

  return [

    ...knowledge.patterns,

  ];

}