import { buildContext } from "./context";
import { buildActions } from "./actions";
import { buildPlan } from "./planner";

export function buildOrchestrator(
  context: any
) {

  const aiContext =
    buildContext(context);

  const actions =
    buildActions(aiContext);

  const plan =
    buildPlan(actions);

  return {

    context: aiContext,

    actions: plan,

  };

}