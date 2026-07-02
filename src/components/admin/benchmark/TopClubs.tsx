"use client";

type Props = {
  ranking: any[];
};

export default function TopClubs({
  ranking,
}: Props) {

  return (

    <div className="bg-[#132a44] rounded-2xl p-8">

      <h2 className="text-xl font-semibold mb-6">

        🏆 Top Clubs

      </h2>

      <div className="space-y-4">

        {ranking
          .slice(0, 5)
          .map((club) => (

            <div
              key={club.clubId}
              className="flex justify-between"
            >

              <div>

                {club.clubName}

              </div>

              <div>

                Top {101 - club.percentile}%

              </div>

            </div>

        ))}

      </div>

    </div>

  );

}