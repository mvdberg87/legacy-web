"use client";

import type { Decision } from "@/lib/admin/intelligence/platform/types";

type Props = {
  decisions: Decision[];
};

const COLORS = {
  growth: "bg-green-500",
  revenue: "bg-blue-500",
  risk: "bg-red-500",
  activation: "bg-yellow-500",
};

export default function DecisionCenter({
  decisions,
}: Props) {
  return (
    <div className="bg-[#132a44] rounded-2xl p-8">

      <h2 className="text-2xl font-semibold text-white mb-2">
        CEO Decision Center
      </h2>

      <p className="text-gray-400 mb-8">
        Prioriteiten die vandaag de meeste impact hebben.
      </p>

      <div className="space-y-5">

        {decisions.map((decision) => (

          <div
            key={`${decision.priority}-${decision.title}`}
            className="bg-[#0d1b2a] rounded-xl p-5 border border-slate-700"
          >

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <span className="text-xl font-bold text-white">
                  #{decision.priority}
                </span>

                <span
                  className={`text-xs text-white px-2 py-1 rounded-full ${COLORS[decision.category]}`}
                >
                  {decision.category.toUpperCase()}
                </span>

              </div>

              <div className="text-sm text-gray-400">
                Confidence {decision.confidence}%
              </div>

            </div>

            <div className="mt-4 text-lg font-semibold text-white">
              {decision.title}
            </div>

            <div className="mt-2 text-gray-300">
              {decision.description}
            </div>

            <div className="mt-4 text-green-400 font-medium">
              Verwachte impact: {decision.impact}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}