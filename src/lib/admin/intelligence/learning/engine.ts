import { loadLearningHistory } from "./history";
import { buildMemory } from "./memory";
import { calculateFeedback } from "./feedback";
import { evaluateLearning } from "./evaluation";
import { trainModel } from "./trainer";

export function buildLearningEngine() {

  const history =
    loadLearningHistory();

  const memory =
    buildMemory(history);

  const feedback =
    calculateFeedback(history);

  const evaluation =
    evaluateLearning(history);

  const trainer =
    trainModel();

  return {

    history,

    memory,

    feedback,

    evaluation,

    trainer,

  };

}