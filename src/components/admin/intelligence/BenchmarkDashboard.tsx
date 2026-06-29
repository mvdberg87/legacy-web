"use client";

import SectionCard from "../ui/SectionCard";

type Benchmark = {
  average: number;
  top10Average: number;
  bottom10Average: number;
};

type Props = {
  benchmarks: {
    health: Benchmark;
    ctr: Benchmark;
    pageviews: Benchmark;
    activeJobs: Benchmark;
    shareRate: Benchmark;
  };
};

type CardProps = {
  title: string;
  average: number;
  top: number;
  bottom: number;
  unit?: string;
};

function BenchmarkCard({
  title,
  average,
  top,
  bottom,
  unit = "",
}: CardProps) {
  return (
    <div className="rounded-xl border border-gray-200 p-5 bg-white">

      <h3 className="font-semibold text-[#0d1b2a] mb-5">
        {title}
      </h3>

      <div className="space-y-4">

        <Row
          label="Top 10%"
          value={`${top}${unit}`}
          color="bg-green-500"
        />

        <Row
          label="Gemiddeld"
          value={`${average}${unit}`}
          color="bg-blue-500"
        />

        <Row
          label="Bottom 10%"
          value={`${bottom}${unit}`}
          color="bg-red-500"
        />

      </div>

    </div>
  );
}

function Row({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex justify-between items-center">

      <div className="flex items-center gap-2">

        <div
          className={`h-3 w-3 rounded-full ${color}`}
        />

        <span className="text-sm text-gray-600">
          {label}
        </span>

      </div>

      <span className="font-semibold text-[#0d1b2a]">
        {value}
      </span>

    </div>
  );
}

export default function BenchmarkDashboard({
  benchmarks,
}: Props) {
  return (
    <SectionCard
      title="Benchmarks"
      subtitle="Vergelijk de best presterende clubs met het platformgemiddelde."
    >
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5">

        <BenchmarkCard
          title="Health Score"
          average={benchmarks.health.average}
          top={benchmarks.health.top10Average}
          bottom={benchmarks.health.bottom10Average}
        />

        <BenchmarkCard
          title="CTR"
          average={benchmarks.ctr.average}
          top={benchmarks.ctr.top10Average}
          bottom={benchmarks.ctr.bottom10Average}
          unit="%"
        />

        <BenchmarkCard
          title="Pageviews"
          average={benchmarks.pageviews.average}
          top={benchmarks.pageviews.top10Average}
          bottom={benchmarks.pageviews.bottom10Average}
        />

        <BenchmarkCard
          title="Actieve vacatures"
          average={benchmarks.activeJobs.average}
          top={benchmarks.activeJobs.top10Average}
          bottom={benchmarks.activeJobs.bottom10Average}
        />

        <BenchmarkCard
          title="Share Rate"
          average={benchmarks.shareRate.average}
          top={benchmarks.shareRate.top10Average}
          bottom={benchmarks.shareRate.bottom10Average}
          unit="%"
        />

      </div>

    </SectionCard>
  );
}