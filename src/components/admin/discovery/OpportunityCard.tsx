"use client";

type Props = {
  opportunity: any;
};

export default function OpportunityCard({
  opportunity,
}: Props) {

  return (

    <div className="bg-[#132a44] rounded-xl p-6">

      <div className="text-lg font-semibold">

        {opportunity.title}

      </div>

      <div className="text-gray-400 mt-2">

        {opportunity.description}

      </div>

      <div className="mt-4 flex gap-6">

        <span>

          ⭐ Score

          {opportunity.score}

        </span>

        <span>

          💰 €{opportunity.estimatedRevenue}

        </span>

        <span>

          🎯 {opportunity.confidence}%

        </span>

      </div>

    </div>

  );

}