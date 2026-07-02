"use client";

type Props = {
  assistant: any;
  platform: any;
};

export default function MissionHeader({
  assistant,
  platform,
}: Props) {

  return (

    <div className="bg-[#08111d] rounded-3xl p-8">

      <div className="flex justify-between items-center">

        <div>

          <div className="text-gray-400 uppercase text-sm">
            AI Mission Briefing
          </div>

          <div className="text-3xl font-bold mt-2">

            {assistant.summary.title}

          </div>

          <div className="text-gray-400 mt-4">

            {assistant.summary.description}

          </div>

        </div>

        <div className="text-right">

          <div className="text-gray-400">
            Mission Score
          </div>

          <div className="text-6xl font-bold text-green-400">

            {platform.health.score}

          </div>

        </div>

      </div>

    </div>

  );

}