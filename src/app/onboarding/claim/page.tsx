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
}, 1500);
    } catch {
      setStatus("error");
    }
  }

  claim();
}, [token, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0d1b2a] p-6">
      <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
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
    <h1 className="text-xl font-semibold mb-2">
      Club geactiveerd
    </h1>
    <p>
      Je club is succesvol geactiveerd.
      Je wordt doorgestuurd naar de loginpagina…
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
