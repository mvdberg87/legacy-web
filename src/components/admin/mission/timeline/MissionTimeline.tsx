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

    {items.length === 0 ? (

      <div className="rounded-xl bg-[#0d1b2a] p-6 text-center">

        <div className="text-lg font-semibold text-white">

          Nog geen AI-activiteiten

        </div>

        <div className="mt-2 text-sm text-gray-400">

          Nieuwe analyses en gebeurtenissen verschijnen hier automatisch.

        </div>

      </div>

    ) : (

      items.map((item) => (

        <TimelineItem

          key={item.id}

          item={item}

        />

      ))

    )}

  </div>

);

}