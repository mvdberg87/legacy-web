"use client";

type Props = {
  title: string;
  description: string;
};

export default function MetricTooltip({
  title,
  description,
}: Props) {
  return (
    <div className="max-w-xs">

      <h3 className="font-semibold text-sm mb-1">
        {title}
      </h3>

      <p className="text-xs text-gray-500 leading-relaxed">
        {description}
      </p>

    </div>
  );
}