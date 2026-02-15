"use client";

import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AdminLoginPage() {
  const supabase = getSupabaseBrowser();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [hasRequested, setHasRequested] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (hasRequested) {
      setStatus(
        "Controleer je e-mail. De magic link is al verstuurd."
      );
      return;
    }

    setHasRequested(true);
    setStatus(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
  `${window.location.origin}/auth/admin-callback`,
      },
    });

    if (error) {
      setStatus(error.message);
      setHasRequested(false);
      return;
    }

    setStatus(
      "Controleer je e-mail om in te loggen."
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center p-6">
      <div className="bg-white text-black rounded-2xl shadow w-full max-w-sm p-6 space-y-6">
        <h1 className="text-lg font-semibold text-center">
          Admin login
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@sponsorjobs.nl"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <button
            type="submit"
            disabled={hasRequested}
            className="w-full bg-[#0d1b2a] text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {hasRequested
              ? "E-mail verzonden"
              : "Login"}
          </button>
        </form>

        {status && (
          <p className="text-sm text-center text-gray-600">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
