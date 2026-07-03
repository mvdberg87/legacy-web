"use client";

import MissionSection from "./ui/MissionSection";

import CEOAssistant from "../assistant/CEOAssistant";
import DiscoveryDashboard from "../discovery/DiscoveryDashboard";
import MissionTimeline from "./timeline/MissionTimeline";

type Props = {
  mission: any;
};

export default function MissionWorkspace({
  mission,
}: Props) {

  return (

  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

    {/* Linkerkant */}

    <div className="xl:col-span-2 space-y-8">

      <MissionSection
        title="Vandaag aanbevolen"
        subtitle="Prioriteiten van de AI"
      >

        <CEOAssistant
          assistant={mission.assistant}
        />

      </MissionSection>

      <MissionSection
        title="Nieuwe kansen"
        subtitle="Automatisch ontdekt"
      >

        <DiscoveryDashboard
          discovery={mission.discovery}
        />

      </MissionSection>

    </div>

    {/* Rechterkant */}

<div className="sticky top-6 self-start">

  <MissionSection
    title="AI Activity"
    subtitle="Realtime gebeurtenissen"
  >

    <MissionTimeline
      items={mission.timeline.events}
    />

  </MissionSection>

</div>

  </div>

);

}