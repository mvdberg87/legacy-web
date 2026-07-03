import { buildBrainContext } from "./context";
import { rankBrainPriorities } from "./priorities";
import { buildReasoning } from "./reasoning";
import { calculateBrainConfidence } from "./confidence";
import { buildBrainBriefing } from "./briefing";

import type {
  BrainDashboard,
} from "./types";

export function buildBrain(
  mission:any
):BrainDashboard{

  const context=
    buildBrainContext(
      mission
    );

  const priorities =
  rankBrainPriorities(
    context.actions
  );

context.topAction =
  priorities[0] ?? null;

const decisions =
  buildReasoning(
    context
  );

  const confidence=
    calculateBrainConfidence(
      decisions
    );

  return{

    decisions,

    briefing:

      buildBrainBriefing(

        decisions,

        confidence

      ),

  };

}