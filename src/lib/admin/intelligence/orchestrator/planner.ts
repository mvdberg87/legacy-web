import { prioritizeActions } from "./priorities";

export function buildPlan(
  actions: any[]
) {

  return prioritizeActions(actions);

}