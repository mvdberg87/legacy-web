"use client";

import TimelineItem from "./TimelineItem";

type Props = {
  items: any[];
};

export default function MissionTimeline({
  items,
}: Props) {

  return (

    <div className="space-y-4">

      {items.map((item) => (

        <TimelineItem

          key={`${item.time}-${item.title}`}

          item={item}

        />

      ))}

    </div>

  );

}