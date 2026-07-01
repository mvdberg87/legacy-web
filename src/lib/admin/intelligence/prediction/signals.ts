export type PredictionSignals = {

  vacancySignal: number;

  trafficSignal: number;

  clickSignal: number;

  shareSignal: number;

};

export function buildSignals(
  club: {
    activeJobs: number;
    pageviews: number;
    totalClicks: number;
    totalShares: number;
  }
): PredictionSignals {

  return {

    vacancySignal:
      Math.min(100, club.activeJobs * 10),

    trafficSignal:
      Math.min(100, club.pageviews / 2),

    clickSignal:
      Math.min(100, club.totalClicks * 2),

    shareSignal:
      Math.min(100, club.totalShares * 10),

  };

}