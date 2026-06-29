"use client";

import { ReactNode } from "react";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/solid";

type Props = {
  title: string;
  value: string | number;

  icon?: ReactNode;

  subtitle?: string;

  trend?: number;

  trendLabel?: string;

  color?:
    | "emerald"
    | "blue"
    | "amber"
    | "red"
    | "violet"
    | "cyan"
    | "gray";

  onClick?: () => void;
};

const COLORS = {
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  violet: "bg-violet-50 text-violet-600",
  cyan: "bg-cyan-50 text-cyan-600",
  gray: "bg-gray-100 text-gray-600",
};

export default function MetricCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  trendLabel,
  color = "blue",
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="
      bg-white
      rounded-2xl
      border
      border-gray-200
      shadow-sm
      hover:shadow-md
      transition-all
      duration-200
      p-5
      cursor-default
      "
    >
      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2 text-[#0d1b2a]">
            {value}
          </h2>

          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">
              {subtitle}
            </p>
          )}

        </div>

        <div
          className={`
          h-12
          w-12
          rounded-xl
          flex
          items-center
          justify-center
          ${COLORS[color]}
          `}
        >
          {icon}
        </div>

      </div>

      {trend !== undefined && (

        <div className="mt-5 flex items-center gap-2">

          {trend >= 0 ? (
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
          ) : (
            <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
          )}

          <span
            className={
              trend >= 0
                ? "text-green-600 text-sm font-medium"
                : "text-red-600 text-sm font-medium"
            }
          >
            {trend > 0 && "+"}
            {trend}%
          </span>

          {trendLabel && (
            <span className="text-sm text-gray-400">
              {trendLabel}
            </span>
          )}

        </div>

      )}

    </div>
  );
}