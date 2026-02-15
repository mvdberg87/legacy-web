// src/app/forbidden/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
      <div className="max-w-md bg-white shadow-md rounded-2xl border border-gray-200 p-8">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-3">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-semibold mb-1 text-gray-800">
            Toegang geweigerd
          </h1>
          <p className="text-gray-600 text-sm">
            Je hebt geen rechten om deze pagina te bekijken.  
            Neem contact op met de beheerder als je denkt dat dit niet klopt.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Naar startpagina
          </button>
          <button
            onClick={() => router.back()}
            className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Ga terug
          </button>
        </div>
      </div>

      <footer className="text-xs text-gray-400 mt-6">
        Powered by <strong>Sponsorjobs</strong> ⚡ – samen sterker in sponsoring
      </footer>
    </main>
  );
}
