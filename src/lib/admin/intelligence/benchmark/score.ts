export function calculateBenchmarkScore(
  club: {
    activeJobs: number;
    pageviews: number;
    totalClicks: number;
    totalShares: number;
  }
) {

  return (

    club.activeJobs * 10 +

    club.pageviews / 10 +

    club.totalClicks +

    club.totalShares * 3

  );

}