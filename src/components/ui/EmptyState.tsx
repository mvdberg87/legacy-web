"use client";

type Props = {
  title: string;
  description: string;
};

export default function EmptyState({
  title,
  description,
}: Props) {

  return (

    <div className="rounded-2xl bg-[#132a44] p-8 text-center">

      <div className="text-lg font-semibold text-white">

        {title}

      </div>

      <div className="mt-3 text-gray-400">

        {description}

      </div>

    </div>

  );

}