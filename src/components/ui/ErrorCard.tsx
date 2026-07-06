"use client";

type Props = {
  message?: string;
};

export default function ErrorCard({
  message = "Er ging iets mis. Probeer het opnieuw.",
}: Props) {

  return (

    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8">

      <div className="text-lg font-semibold text-red-300">

        ⚠️ Oeps...

      </div>

      <div className="mt-3 text-red-200">

        {message}

      </div>

    </div>

  );

}