"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function MissionSection({
  title,
  subtitle,
  children,
}: Props) {

  return (

    <section className="space-y-4">

      <div>

        <h2 className="text-xl font-semibold">
          {title}
        </h2>

        {subtitle && (

          <p className="text-gray-400 mt-1">
            {subtitle}
          </p>

        )}

      </div>

      {children}

    </section>

  );

}