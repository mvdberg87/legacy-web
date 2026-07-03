"use client";

type Props = {
  title: string;
};

export default function MissionEmptyState({
  title,
}: Props) {

  return (

    <div
      className="
        rounded-xl
        border
        border-dashed
        border-white/10
        py-12
        text-center
        text-gray-500
      "
    >

      {title}

    </div>

  );

}