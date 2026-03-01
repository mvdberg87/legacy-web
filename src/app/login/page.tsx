"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function ClubLoginPage() {
  const supabase = getSupabaseBrowser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     STAP 1 – CODE VERSTUREN
  =============================== */
  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus("Versturen van inlogcode…");

    const { error } = await supabase.auth.signInWithOtp({
  email: email.toLowerCase().trim(),
  options: {
    shouldCreateUser: false,
  },
});

    if (error) {
      console.error(error.message);
      setStatus(
        "Dit e-mailadres is (nog) niet bekend. Meld je eerst aan."
      );
    } else {
      setStep("code");
      setStatus(
        "Er is een 6-cijferige code naar je e-mailadres gestuurd."
      );
    }

    setLoading(false);
  }

  /* ===============================
     STAP 2 – CODE VERIFIËREN
  =============================== */
  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code) return;

    setLoading(true);
    setStatus("Controleren van code…");

    const { error } = await supabase.auth.verifyOtp({
  email: email.toLowerCase().trim(),
  token: code.trim(),
  type: "email",
});

if (error) {
  console.error(error.message);
  setStatus("Ongeldige of verlopen code.");
  setLoading(false);
  return;
}

// 🔥 1️⃣ Ingelogde user ophalen
const { data: sessionData } = await supabase.auth.getSession();
const user = sessionData?.session?.user;

if (!user) {
  setStatus("Kon gebruiker niet ophalen.");
  setLoading(false);
  return;
}

// 🔥 2️⃣ Profiel ophalen
const { data: profile } = await supabase
  .from("profiles")
  .select("club_id")
  .eq("user_id", user.id)
  .maybeSingle();

if (!profile?.club_id) {
  setStatus("Geen club gekoppeld aan dit account.");
  setLoading(false);
  return;
}

// 🔥 3️⃣ Club slug ophalen
const { data: club } = await supabase
  .from("clubs")
  .select("slug")
  .eq("id", profile.club_id)
  .maybeSingle();

if (!club?.slug) {
  setStatus("Club niet gevonden.");
  setLoading(false);
  return;
}

// 🔥 4️⃣ Redirect naar juiste dashboard
router.push(`/club/${club.slug}/dashboard`);
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

        {/* ===============================
            STAP 1 – EMAIL
        =============================== */}
        {step === "email" && (
          <form onSubmit={handleSendCode} className="space-y-4">

            <input
              type="email"
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
              {loading ? "Versturen…" : "Verstuur inlogcode"}
            </button>

          </form>
        )}

        {/* ===============================
            STAP 2 – CODE
        =============================== */}
        {step === "code" && (
          <form onSubmit={handleVerifyCode} className="space-y-4">

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              placeholder="Voer 6-cijferige code in"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="
                w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-sm
                text-center tracking-widest
                text-[#0d1b2a]
                focus:outline-none focus:border-[#0d1b2a]
              "
            />

            <button
              type="submit"
              disabled={loading}
              className="
                w-full rounded-xl px-4 py-2 text-sm font-semibold transition
                bg-[#0d1b2a] text-white
                hover:bg-[#132a44]
                disabled:opacity-60
              "
            >
              {loading ? "Controleren…" : "Inloggen"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setStatus(null);
              }}
              className="text-xs text-gray-500 underline w-full"
            >
              Ander e-mailadres gebruiken
            </button>

          </form>
        )}

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