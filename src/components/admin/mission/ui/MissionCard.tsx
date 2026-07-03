"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function MissionCard({
  children,
  className = "",
}: Props) {

  return (

    <div
      className={`
        bg-[#132a44]
        rounded-2xl
        p-6
        border
        border-white/5
        shadow-lg
        ${className}
      `}
    >

      {children}

    </div>

  );

}