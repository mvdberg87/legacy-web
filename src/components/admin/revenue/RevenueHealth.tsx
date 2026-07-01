"use client";

type Props = {
  health: {
    score: number;
    label: string;
    color: string;
  };
};

const COLORS = {
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
};

export default function RevenueHealth({
  health,
}: Props) {
  return (
    <div className="bg-[#132a44] rounded-2xl p-8 mb-12">

      <div className="flex items-center justify-between">

        <div>

          <div className="text-sm text-gray-400">
            Revenue Health
          </div>

          <div className="text-5xl font-bold mt-2">
            {health.score}/100
          </div>

          <div className="mt-2 text-lg">
            {health.label}
          </div>

        </div>

        <div
          className={`h-6 w-6 rounded-full ${
            COLORS[
              health.color as keyof typeof COLORS
            ]
          }`}
        />

      </div>

    </div>
  );
}