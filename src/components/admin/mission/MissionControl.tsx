"use client";

import MissionHeader from "./MissionHeader";
import MissionOverview from "./MissionOverview";
import MissionWorkspace from "./MissionWorkspace";
import MissionFooter from "./MissionFooter";

type Props = {
  mission: any;
};

export default function MissionControl({
  mission,
}: Props) {

  return (

    <div className="space-y-8">

      <MissionHeader
        assistant={mission.assistant}
        platform={mission.platform}
      />

      <MissionOverview
        mission={mission}
      />

      <MissionWorkspace
        mission={mission}
      />

      <MissionFooter
        mission={mission}
      />

    </div>

  );

}