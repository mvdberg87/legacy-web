"use client";

import TopClubs from "./TopClubs";
import BenchmarkInsights from "./BenchmarkInsights";
import BenchmarkRecommendations from "./BenchmarkRecommendations";

type Props = {
  benchmark: any;
};

export default function BenchmarkDashboard({
  benchmark,
}: Props) {

  return (

    <div className="space-y-8">

      <TopClubs
        ranking={benchmark.ranking}
      />

      <BenchmarkInsights
        insights={benchmark.insights}
      />

      <BenchmarkRecommendations
        recommendations={
          benchmark.recommendations
        }
      />

    </div>

  );

}