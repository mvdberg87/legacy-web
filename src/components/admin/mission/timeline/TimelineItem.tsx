"use client";

import MissionCard from "../ui/MissionCard";
import MissionBadge from "../ui/MissionBadge";

type Props = {
  item: {
  id: string;
  time: string;
  title: string;
  description: string;
  icon: string;
  color: string;
};
};

export default function TimelineItem({
  item,
}: Props) {

  return (

    <MissionCard>

      <div className="flex justify-between items-start">

        <div className="flex-1 pr-4">

          <div className="flex items-center gap-2">

  <span className="text-xl">

    {item.icon}

  </span>

  <MissionBadge text={item.color} />

</div>

          <div className="mt-3 text-white font-semibold">

            {item.title}

          </div>

          <div className="mt-2 text-sm leading-6 text-gray-400">

            {item.description}

          </div>

        </div>

        <div className="shrink-0 text-sm font-medium text-gray-500">

  {item.time}

</div>

      </div>

    </MissionCard>

  );

}