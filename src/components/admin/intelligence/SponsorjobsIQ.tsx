"use client";

import SectionCard from "./SectionCard";

export type IntelligenceInsight = {
  title: string;

  finding: string;

  confidence: number;

  impact?: string;

  recommendation: string;
};

type Props = {
  insights: IntelligenceInsight[];
};

export default function SponsorjobsIQ({
  insights,
}: Props) {
  return (
    <SectionCard
      title="Sponsorjobs IQ"
      subtitle="Het platform leert continu welke factoren bijdragen aan succesvolle verenigingen."
    >
      <div className="space-y-5">

        {insights.length === 0 && (
          <div className="rounded-xl border border-gray-200 p-5">
            <p className="text-gray-500">
              Nog onvoldoende data beschikbaar om betrouwbare inzichten te tonen.
            </p>
          </div>
        )}

        {insights.map((insight, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 p-5 hover:shadow-sm transition"
          >
            <div className="flex items-start justify-between gap-6">

              <div className="flex-1">

                <h3 className="font-semibold text-[#0d1b2a]">
                  {insight.title}
                </h3>

                <p className="text-gray-600 mt-2 leading-relaxed">
                  {insight.finding}
                </p>

                <div className="mt-5 rounded-lg bg-blue-50 border border-blue-100 p-4">

                  <p className="text-sm font-medium text-[#0d1b2a]">
                    Aanbevolen actie
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    {insight.recommendation}
                  </p>

                </div>

              </div>

              <div className="w-44">

                <div className="text-sm text-gray-500 mb-2">
                  Betrouwbaarheid
                </div>

                <div className="font-semibold text-xl text-[#0d1b2a]">
                  {insight.confidence}%
                </div>

                <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">

                  <div
                    className="h-full bg-[#0d1b2a]"
                    style={{
                      width: `${insight.confidence}%`,
                    }}
                  />

                </div>

                {insight.impact && (
                  <div className="mt-5 rounded-lg bg-green-50 border border-green-100 p-3">

                    <div className="text-xs uppercase tracking-wide text-gray-500">
                      Verwachte impact
                    </div>

                    <div className="mt-1 font-semibold text-green-700">
                      {insight.impact}
                    </div>

                  </div>
                )}

              </div>

            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}