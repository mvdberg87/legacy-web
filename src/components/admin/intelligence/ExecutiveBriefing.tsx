"use client";

import SectionCard from "./SectionCard";

export type BriefingItem = {
  severity: "good" | "warning" | "info" | "critical";
  title: string;
  description: string;
};

type Props = {
  score: number;
  items: BriefingItem[];
};

const COLORS = {
  good: "bg-green-500",
  info: "bg-blue-500",
  warning: "bg-yellow-500",
  critical: "bg-red-500",
};

export default function ExecutiveBriefing({
  score,
  items,
}: Props) {
  return (
    <SectionCard
      title="Executive Briefing"
      subtitle="Belangrijkste ontwikkelingen van vandaag."
    >
      <div className="space-y-6">

        <div className="rounded-xl bg-[#0d1b2a] text-white p-6">

          <div className="text-sm opacity-80">
            Platform Health Score
          </div>

          <div className="text-5xl font-bold mt-2">
            {score}/100
          </div>

        </div>

        <div className="space-y-4">

          {items.map((item, index) => (

            <div
              key={index}
              className="flex gap-4 items-start border rounded-xl p-4"
            >

              <div
                className={`h-3 w-3 rounded-full mt-2 ${COLORS[item.severity]}`}
              />

              <div>

                <div className="font-semibold text-[#0d1b2a]">
                  {item.title}
                </div>

                <div className="text-sm text-gray-600 mt-1">
                  {item.description}
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </SectionCard>
  );
}