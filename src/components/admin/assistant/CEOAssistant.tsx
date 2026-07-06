"use client";

type Props = {
  assistant: any;
};

export default function CEOAssistant({
  assistant,
}: Props) {

  return (

    <div className="bg-[#132a44] rounded-2xl p-8 mb-12">

      <div className="space-y-6">

  <div>

    <div className="inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">

  AI CEO Briefing

</div>

    <h2 className="text-3xl font-bold text-white">

      {assistant.summary.greeting}

    </h2>

  </div>

  <div className="rounded-xl bg-[#0d1b2a] p-5">

    <div className="text-sm uppercase tracking-wide text-gray-400">

      Platformstatus

    </div>

    <p className="text-white mt-2">

      {assistant.summary.platformStatus}

    </p>

  </div>

  <div className="rounded-xl bg-[#0d1b2a] p-5">

    <div className="text-sm uppercase tracking-wide text-gray-400">

      Mijn advies

    </div>

    <p className="text-white mt-2">

      {assistant.summary.recommendation}

    </p>

  </div>

</div>

      <h3 className="text-xl font-semibold mt-10 mb-4">

  📋 Belangrijkste inzichten

</h3>

      <div className="space-y-4">

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

      {/* Nieuwe Action Engine */}

      <div className="mt-10">

        <h2 className="text-xl font-semibold mb-4">

  🎯 Top 3 acties voor vandaag

</h2>

        <div className="space-y-4">


          {assistant.actions.actions
  .slice(0, 3)
  .map((action: any, index: number) => (

              <div
                key={action.id}
                className="rounded-xl bg-[#0d1b2a] p-5"
              >

                {index === 0 && (

  <div className="mb-3 inline-flex rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300">

    Hoogste prioriteit

  </div>

)}

                <div className="font-semibold text-white">
                  {action.title}
                </div>

                <div className="text-gray-400 mt-2">
                  {action.description}
                </div>

                <div className="text-green-400 mt-3">
                  Impact {action.impact} · Confidence {action.confidence}%
                </div>

              </div>

            ))}

        </div>

      </div>

    </div>

  );

}