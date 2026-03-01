"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AdminLoginPage() {
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
    setStatus(error.message);
    setLoading(false);
    return;
  }

  setStep("code");
  setStatus("Er is een 6-cijferige code verstuurd.");
  setLoading(false);
}

  /* ===============================
     STAP 2 – CODE CONTROLEREN
  =============================== */
  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code) return;

    setLoading(true);
    setStatus("Controleren van code…");

    const { error } = await supabase.auth.verifyOtp({
  email,
  token: code.trim(),
  type: "email",
});

if (error) {
  setStatus("Ongeldige of verlopen code.");
  setLoading(false);
  return;
}

// 🔥 Ingelogde user ophalen
const { data: sessionData } = await supabase.auth.getSession();
const user = sessionData?.session?.user;

if (!user) {
  setStatus("Kon gebruiker niet ophalen.");
  setLoading(false);
  return;
}

// 🔥 Admin check (op basis van env)
const allowedAdmins =
  process.env.NEXT_PUBLIC_SPONSORJOBS_ADMIN_EMAILS?.split(",") ?? [];

if (!allowedAdmins.includes(user.email ?? "")) {
  setStatus("Geen toegang tot admin.");
  setLoading(false);
  await supabase.auth.signOut();
  return;
}

// ✅ Redirect naar admin
router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center p-6">
      <div className="bg-white text-black rounded-2xl shadow w-full max-w-sm p-6 space-y-6">

        <h1 className="text-lg font-semibold text-center">
          Admin login
        </h1>

        {/* ===============================
            STAP 1 – EMAIL
        =============================== */}
        {step === "email" && (
          <form onSubmit={handleSendCode} className="space-y-4">

            <input
              type="email"
              required
              placeholder="admin@sponsorjobs.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d1b2a] text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
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
              className="w-full border rounded-lg px-3 py-2 text-sm text-center tracking-widest"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
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

      </div>
    </div>
  );
}