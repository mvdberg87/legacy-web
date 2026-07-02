"use client";

type Props = {
  recommendations: Record<
    string,
    any[]
  >;
};

export default function BenchmarkRecommendations({
  recommendations,
}: Props) {

  return (

    <div className="bg-[#132a44] rounded-2xl p-8">

      <h2 className="text-xl font-semibold">

        AI Recommendations

      </h2>

      <div className="mt-6 space-y-4">

        {Object.values(recommendations)

          .flat()

          .slice(0, 5)

          .map((item, index) => (

            <div key={index}>

              <div className="font-semibold">

                {item.title}

              </div>

              <div className="text-gray-400">

                {item.description}

              </div>

            </div>

        ))}

      </div>

    </div>

  );

}