"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ClubOverviewPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-6">🏟️ Club Dashboard</h1>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
  variant="outline"
  onClick={() => router.push(`/club/${slug}/dashboard`)}
>
  📊 Statistieken
</Button>
        <Button
  variant="outline"
  onClick={() => router.push(`/club/${slug}/jobs`)}
>
  💼 Vacatures
</Button>
        <Button
  variant="outline"
  onClick={() => router.push(`/club/${slug}/edit`)}
>
  ⚙️ Club bewerken
</Button>
      </div>
    </main>
  );
}
