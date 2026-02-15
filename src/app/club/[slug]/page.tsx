"use client";

import { useRouter, useParams } from "next/navigation";

export default function ClubOverviewPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-6">🏟️ Club Dashboard</h1>
      <div className="flex gap-3">
        <button
          onClick={() => router.push(`/club/${slug}/dashboard`)}
          className="px-4 py-2 border rounded-lg hover:bg-blue-50"
        >
          📊 Statistieken
        </button>
        <button
          onClick={() => router.push(`/club/${slug}/jobs`)}
          className="px-4 py-2 border rounded-lg hover:bg-blue-50"
        >
          💼 Vacatures
        </button>
        <button
          onClick={() => router.push(`/club/${slug}/edit`)}
          className="px-4 py-2 border rounded-lg hover:bg-blue-50"
        >
          ⚙️ Club bewerken
        </button>
      </div>
    </main>
  );
}
