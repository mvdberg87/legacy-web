import { buildFacts } from "./facts";
import { buildPatterns } from "./patterns";
import { buildKnowledgeMemory } from "./memory";
import { generateKnowledgeInsights } from "./insights";

export function buildKnowledgeEngine() {

  const facts =
    buildFacts();

  const patterns =
    buildPatterns();

  const memory =
    buildKnowledgeMemory();

  const insights =
    generateKnowledgeInsights({

      facts,

      patterns,

    });

  return {

    facts,

    patterns,

    memory,

    insights,

  };

}