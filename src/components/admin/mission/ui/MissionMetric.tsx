"use client";

type Props = {
  label: string;
  value: string | number;
  trend?: string;
};

export default function MissionMetric({
  label,
  value,
  trend,
}: Props) {

  return (

    <div>

      <div className="text-gray-400 text-sm">

        {label}

      </div>

      <div className="text-4xl font-bold mt-2">

        {value}

      </div>

      {trend && (

        <div className="text-green-400 text-sm mt-2">

          {trend}

        </div>

      )}

    </div>

  );

}