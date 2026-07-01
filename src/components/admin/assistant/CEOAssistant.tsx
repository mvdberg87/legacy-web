"use client";

type Props = {
  assistant: any;
};

export default function CEOAssistant({
  assistant,
}: Props) {

  return (

    <div className="bg-[#132a44] rounded-2xl p-8 mb-12">

      <h2 className="text-2xl font-semibold text-white">
        🧠 CEO Briefing
      </h2>

      <p className="text-gray-400 mt-2">
        {assistant.summary.description}
      </p>

      <div className="mt-8 space-y-4">

        {assistant.priorities.map(
          (priority: any, index: number) => (

            <div
              key={index}
              className="rounded-xl bg-[#0d1b2a] p-5"
            >

              <div className="font-semibold text-white">
                {priority.title}
              </div>

              <div className="text-gray-400 mt-2">
                {priority.description}
              </div>

              <div className="text-green-400 mt-3">
                Impact: {priority.impact}
              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

}