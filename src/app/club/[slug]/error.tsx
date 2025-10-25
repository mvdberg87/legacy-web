"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log eventueel naar console of monitoring
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="p-6">
      <h1 className="font-semibold text-lg text-red-600">Er ging iets mis 😕</h1>
      <p className="text-sm opacity-70 mt-2">{error.message}</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => reset()}
          className="px-3 py-2 border rounded hover:bg-gray-50"
        >
          Probeer opnieuw
        </button>
        <button
          onClick={() => location.reload()}
          className="px-3 py-2 border rounded hover:bg-gray-50"
        >
          Herlaad pagina
        </button>
      </div>
    </div>
  );
}
