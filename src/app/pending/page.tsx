// pending/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function PendingPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowser();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (checking) return;
      setChecking(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      // 1️⃣ profile → alleen club_id
      const { data: profile } = await supabase
        .from("profiles")
        .select("club_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile?.club_id) {
        setChecking(false);
        return;
      }

      // 2️⃣ club ophalen via club_id
      const { data: club } = await supabase
        .from("clubs")
        .select("slug, status")
        .eq("id", profile.club_id)
        .maybeSingle();

      // ✅ club approved → dashboard
      if (club?.status === "approved" && club.slug) {
        console.log("✅ Club goedgekeurd, door naar dashboard:", club.slug);
        clearInterval(interval);
        router.replace(`/club/${club.slug}/dashboard`);
      }

      setChecking(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [router, supabase, checking]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center bg-slate-50 p-6">
      <h1 className="text-2xl font-semibold mb-2">
        ⏳ Je account is nog niet goedgekeurd
      </h1>
      <p className="max-w-md text-sm opacity-80">
        Zodra de administrator je account heeft geactiveerd, word je automatisch
        doorgestuurd naar jouw clubomgeving. Je hoeft niets te doen — dit scherm
        ververst zichzelf elke 10 seconden.
      </p>
    </main>
  );
}
