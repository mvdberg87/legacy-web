"use client";

import SectionCard from "../ui/SectionCard";

export type SuccessFactor = {
  title: string;

  impact: string;

  confidence: number;

  description: string;

  recommendation: string;
};

type Props = {
  factors: SuccessFactor[];
};

export default function SuccessFactors({
  factors,
}: Props) {
  return (
    <SectionCard
      title="Success Factors"
      subtitle="Welke factoren dragen volgens Sponsorjobs het meest bij aan succes?"
    >
      <div className="space-y-4">

        {factors.length === 0 && (

          <div className="rounded-xl border border-gray-200 p-5">

            <p className="text-gray-500">
              Nog onvoldoende data beschikbaar om patronen te ontdekken.
            </p>

          </div>

        )}

        {factors.map((factor, index) => (

          <div
            key={index}
            className="rounded-xl border border-gray-200 p-5 hover:shadow-sm transition"
          >

            <div className="flex justify-between items-start">

              <div>

                <h3 className="font-semibold text-[#0d1b2a]">
                  {factor.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {factor.description}
                </p>

              </div>

              <div className="text-right">

                <div className="text-xl font-bold text-green-600">
                  {factor.impact}
                </div>

                <div className="text-xs text-gray-500">
                  Impact
                </div>

              </div>

            </div>

            <div className="mt-5">

              <div className="flex justify-between text-sm mb-2">

                <span className="text-gray-500">
                  Betrouwbaarheid
                </span>

                <span className="font-medium">
                  {factor.confidence}%
                </span>

              </div>

              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">

                <div
                  className="h-full bg-[#0d1b2a]"
                  style={{
                    width: `${factor.confidence}%`,
                  }}
                />

              </div>

            </div>

            <div className="mt-5 rounded-lg bg-blue-50 border border-blue-100 p-4">

              <div className="text-sm font-medium text-[#0d1b2a]">
                Aanbevolen actie
              </div>

              <div className="text-sm text-gray-600 mt-1">
                {factor.recommendation}
              </div>

            </div>

          </div>

        ))}

      </div>

    </SectionCard>
  );
}