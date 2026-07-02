export type BenchmarkInsight = {
  title: string;
  description: string;
  priority: number;
};

export type BenchmarkRecommendation = {
  title: string;
  description: string;
};

export type BenchmarkClub = {

  id: string;

  name: string;

  activeJobs: number;

  pageviews: number;

  totalClicks: number;

  totalShares: number;

};

export type BenchmarkResult = {

  clubId: string;

  clubName: string;

  percentile: number;

  rank: number;

  totalClubs: number;

  score: number;

  group:
  | "small"
  | "medium"
  | "large";

};

export type BenchmarkDashboard = {

  ranking: BenchmarkResult[];

  insights: Record<
    string,
    BenchmarkInsight[]
  >;

  recommendations: Record<
    string,
    BenchmarkRecommendation[]
  >;

};