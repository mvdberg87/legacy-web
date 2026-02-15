"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function LogoutPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowser();

  useEffect(() => {
    const doLogout = async () => {
      await supabase.auth.signOut();
      console.log("👋 Gebruiker uitgelogd");

      // Harde redirect om middleware + cookies te resetten
      window.location.href = "/login";
    };

    doLogout();
  }, [supabase]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>Je wordt uitgelogd...</p>
    </main>
  );
}
