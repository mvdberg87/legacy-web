// app/club/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import getSupabaseBrowser from "@/lib/supabaseBrowser";

export default function ClubRouterPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowser();

  useEffect(() => {
    const run = async () => {
      /* ===============================
         1️⃣ User check
      =============================== */
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      /* ===============================
         2️⃣ Profiel → alleen club_id
      =============================== */
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("club_id")
        .eq("user_id", user.id)
        .maybeSingle();

      console.log("PROFILE RESULT:", profile);

      if (profileError) {
        console.error("Profile load error:", profileError);
        router.replace("/login");
        return;
      }

      // ❌ Geen club gekoppeld → claim flow
      if (!profile?.club_id) {
        router.replace("/onboarding/claim");
        return;
      }

      /* ===============================
         3️⃣ Club ophalen via club_id
      =============================== */
      const { data: club, error: clubError } = await supabase
        .from("clubs")
        .select("slug, status")
        .eq("id", profile.club_id)
        .maybeSingle();

      console.log("CLUB RESULT:", club);

      if (clubError || !club) {
        console.error("Club load error:", clubError);
        router.replace("/onboarding/claim");
        return;
      }

      // ⏳ Club bestaat maar is nog niet approved
      if (club.status !== "approved") {
        router.replace("/pending");
        return;
      }

      /* ===============================
         4️⃣ Alles OK → dashboard
      =============================== */
      router.replace(`/club/${club.slug}/dashboard`);
    };

    run();
  }, [router, supabase]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      Even geduld… we laden je clubdashboard 🏟️
    </main>
  );
}
