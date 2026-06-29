"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function SectionCard({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow border border-gray-200">

      <div className="border-b border-gray-200 px-6 py-5">

        <h2 className="text-lg font-semibold text-[#0d1b2a]">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        )}

      </div>

      <div className="p-6">
        {children}
      </div>

    </div>
  );
}