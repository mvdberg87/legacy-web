"use client";

import { useState } from "react";
import Link from "next/link";
import getSupabaseBrowser from "@/lib/supabaseBrowser";

export default function ClubLoginPage() {
  const supabase = getSupabaseBrowser();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  if (!email) return;

  setLoading(true);
  setStatus("Magic link wordt verstuurd…");

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      // ✅ JUISTE CALLBACK
      emailRedirectTo: `${window.location.origin}/auth/club-callback`,
    },
  });

  if (error) {
    console.error(error.message);
    setStatus(
      "Dit e-mailadres is (nog) niet bekend. Meld je eerst aan."
    );
  } else {
    setStatus("Check je mailbox voor de magic link.");
  }

  setLoading(false);
}

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0d1b2a] p-6">
      <div className="w-full max-w-sm bg-white border-2 border-white rounded-2xl p-6 shadow-xl space-y-5">
        <h1 className="text-xl font-semibold text-center">
          Club Login
        </h1>

        <h2 className="text-lg font-bold text-center text-[#0d1b2a]">
          WELKOM BIJ SPONSORJOBS
        </h2>

        <p className="text-sm text-gray-600 text-center">
          Log in met het e-mailadres dat gekoppeld is aan je clubaccount.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="bijv. contact@club.nl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-sm
              text-[#0d1b2a] placeholder:text-gray-400
              focus:outline-none focus:border-[#0d1b2a]
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full rounded-xl px-4 py-2 text-sm font-semibold transition
              bg-[#1f9d55] text-white
              hover:bg-[#15803d]
              disabled:opacity-60
            "
          >
            {loading ? "Versturen…" : "Verstuur magic link"}
          </button>
        </form>

        {status && (
          <p className="text-sm text-center text-gray-600">
            {status}
          </p>
        )}

        <div className="pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Nog geen clubaccount?
          </p>
          <Link
            href="/signup"
            className="text-sm font-semibold text-[#0d1b2a] hover:underline"
          >
            Meld je club aan
          </Link>
        </div>
      </div>
    </main>
  );
}
