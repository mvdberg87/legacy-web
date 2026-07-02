export type BenchmarkGroup =
  | "small"
  | "medium"
  | "large";

export function determineGroup(
  club: {
    pageviews: number;
    activeJobs: number;
  }
): BenchmarkGroup {

  if (
    club.pageviews > 2500 ||
    club.activeJobs > 20
  ) {
    return "large";
  }

  if (
    club.pageviews > 750 ||
    club.activeJobs > 8
  ) {
    return "medium";
  }

  return "small";

}