import type {
  KnowledgeFact,
} from "./types";

export function buildFacts(): KnowledgeFact[] {

  return [

    {
      id: "minimum-vacancies",

      category: "club",

      title:
        "Minimaal vijf vacatures",

      description:
        "Clubs met minimaal vijf vacatures presteren gemiddeld beter.",

      confidence: 92,

      source:
        "Executive Intelligence",

    },

  ];

}