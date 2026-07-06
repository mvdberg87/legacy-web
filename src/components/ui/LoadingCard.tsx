"use client";

type Props = {
  title?: boolean;
  rows?: number;
};

export default function LoadingCard({
  title = true,
  rows = 3,
}: Props) {

  return (

    <div className="animate-pulse rounded-2xl bg-[#132a44] p-6">

      {title && (

        <div className="mb-6 h-6 w-48 rounded bg-slate-700" />

      )}

      <div className="space-y-4">

        {Array.from({ length: rows }).map((_, index) => (

          <div
            key={index}
            className="h-4 rounded bg-slate-700"
          />

        ))}

      </div>

    </div>

  );

}