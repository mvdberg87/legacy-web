"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Status = "loading" | "success" | "error";

export default function ClaimPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
  if (!token) {
    // ⛔ alleen error tonen als we nog niet succesvol zijn
    setStatus((prev) => (prev === "success" ? prev : "error"));
    return;
  }

  async function claim() {
    try {
      const res = await fetch("/api/onboarding/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) throw new Error();

      setStatus("success");

      setTimeout(() => {
  router.replace("/login");
}, 3000);
    } catch {
      setStatus("error");
    }
  }

  claim();
}, [token, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0d1b2a] p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full text-center">
        {status === "loading" && (
          <>
            <h1 className="text-xl font-semibold mb-2">
              Club activeren
            </h1>
            <p>Even geduld, we activeren je club…</p>
          </>
        )}

        {status === "success" && (
  <>
    <h1 className="text-2xl font-semibold mb-4 text-[#0d1b2a]">
      Club succesvol geactiveerd
    </h1>

    <p className="text-gray-700 leading-7">
      Je account is succesvol geactiveerd en gekoppeld aan jouw vereniging.
    </p>

    <p className="mt-5 text-gray-700 leading-7">
      Je kunt nu <strong>2 maanden kosteloos</strong> gebruikmaken van alle
      functionaliteiten van Sponsorjobs en het platform uitgebreid ontdekken.
    </p>

    <p className="mt-5 text-sm text-gray-500">
      Je wordt automatisch doorgestuurd naar de inlogpagina...
    </p>
  </>
)}

        {status === "error" && (
          <>
            <h1 className="text-xl font-semibold mb-2 text-red-600">
              Activatie mislukt
            </h1>
            <p>Deze activatielink is ongeldig of verlopen.</p>
          </>
        )}
      </div>
    </main>
  );
}
