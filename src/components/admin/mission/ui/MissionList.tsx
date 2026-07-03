"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function MissionList({
  children,
}: Props) {

  return (

    <div className="space-y-3">

      {children}

    </div>

  );

}