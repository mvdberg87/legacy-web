"use client";

import SectionCard from "./SectionCard";

export type Recommendation = {
  priority: "critical" | "high" | "medium" | "low";
  category:
    | "growth"
    | "revenue"
    | "activation"
    | "retention"
    | "platform";

  title: string;
  description: string;
  impact: string;
};

type Props = {
  recommendations: Recommendation[];
};

const COLORS = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const LABELS = {
  critical: "Kritiek",
  high: "Hoog",
  medium: "Gemiddeld",
  low: "Laag",
};

export default function Recommendations({
  recommendations,
}: Props) {
  const sorted = [...recommendations].sort((a, b) => {
    const order = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };

    return order[a.priority] - order[b.priority];
  });

  return (
    <SectionCard
      title="Aanbevolen acties"
      subtitle="De belangrijkste acties voor vandaag."
    >
      <div className="space-y-4">

        {sorted.length === 0 && (
          <div className="text-sm text-gray-500">
            Geen aanbevelingen gevonden.
          </div>
        )}

        {sorted.map((recommendation, index) => (
          <div
            key={index}
            className="border rounded-xl p-4"
          >
            <div className="flex justify-between items-center">

              <div className="font-semibold text-[#0d1b2a]">
                {recommendation.title}
              </div>

              <span
                className={`text-white text-xs px-2 py-1 rounded-full ${COLORS[recommendation.priority]}`}
              >
                {LABELS[recommendation.priority]}
              </span>

            </div>

            <div className="text-sm text-gray-600 mt-2">
              {recommendation.description}
            </div>

            <div className="text-sm text-green-700 font-medium mt-3">
              Verwachte impact: {recommendation.impact}
            </div>

          </div>
        ))}

      </div>
    </SectionCard>
  );
}