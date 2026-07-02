import type {
  KnowledgeBase,
} from "./types";

export function searchKnowledge(
  knowledge: KnowledgeBase,
  query: string
) {

  return knowledge.facts.filter(

    (fact) =>

      fact.title
        .toLowerCase()
        .includes(
          query.toLowerCase()
        )

  );

}