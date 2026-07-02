"use client";

import OpportunityCard from "./OpportunityCard";

type Props = {
  discovery: any;
};

export default function DiscoveryDashboard({
  discovery,
}: Props) {

  return (

    <div className="space-y-6">

      <h2 className="text-2xl font-semibold">

        🔍 AI Discovery

      </h2>

      {discovery.opportunities
        .slice(0,5)
        .map((opportunity:any)=>(

          <OpportunityCard

            key={opportunity.id}

            opportunity={opportunity}

          />

      ))}

    </div>

  );

}