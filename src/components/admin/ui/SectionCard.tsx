"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  right?: ReactNode;
};

export default function SectionCard({
  title,
 subtitle,
  children,
  right,
}: Props) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      <div className="border-b border-gray-100 px-6 py-5 flex items-center justify-between">

        <div>

          <h2 className="text-lg font-semibold text-[#0d1b2a]">
            {title}
          </h2>

          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}

        </div>

        {right}

      </div>

      <div className="p-6">
        {children}
      </div>

    </section>
  );
}