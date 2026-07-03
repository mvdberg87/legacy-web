"use client";

import MissionCard from "../ui/MissionCard";
import MissionBadge from "../ui/MissionBadge";

type Props = {
  item: {
    time: string;
    title: string;
    description: string;
    type: string;
  };
};

export default function TimelineItem({
  item,
}: Props) {

  return (

    <MissionCard>

      <div className="flex justify-between items-start">

        <div>

          <MissionBadge text={item.type} />

          <div className="font-semibold mt-3">

            {item.title}

          </div>

          <div className="text-gray-400 mt-2">

            {item.description}

          </div>

        </div>

        <div className="text-sm text-gray-500">

          {item.time}

        </div>

      </div>

    </MissionCard>

  );

}