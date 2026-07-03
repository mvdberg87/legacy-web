"use client";

type Props = {
  text: string;
};

export default function MissionBadge({
  text,
}: Props) {

  return (

    <span
      className="
        inline-flex
        items-center
        rounded-full
        bg-green-500/20
        px-3
        py-1
        text-xs
        font-medium
        text-green-300
      "
    >

      {text}

    </span>

  );

}