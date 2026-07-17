"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

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
        <Button
  variant="outline"
  onClick={reset}
>
  Probeer opnieuw
</Button>
        <Button
  variant="outline"
  onClick={() => location.reload()}
>
  Herlaad pagina
</Button>
      </div>
    </div>
  );
}
