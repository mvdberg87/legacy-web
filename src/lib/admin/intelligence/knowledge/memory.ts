import {
  buildFacts,
} from "./facts";

import {
  buildPatterns,
} from "./patterns";

export function buildKnowledgeMemory() {

  return {

    facts:
      buildFacts(),

    patterns:
      buildPatterns(),

  };

}