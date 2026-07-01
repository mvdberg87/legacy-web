import type {
  PlatformForecast,
} from "./types";

export function generatePlatformForecast(
  mrr: number,
  clubs: number
): PlatformForecast {

  return {

    mrrNextMonth:
      Math.round(mrr * 1.08),

    clubsNextMonth:
      Math.round(clubs * 1.05),

    revenueNextMonth:
      Math.round(mrr * 1.08),

  };

}