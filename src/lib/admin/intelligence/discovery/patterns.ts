import type {
  DiscoverySignal,
} from "./types";

export function detectPatterns(
  signals: DiscoverySignal[]
) {

  return signals.filter(

    signal => signal.value > 50

  );

}