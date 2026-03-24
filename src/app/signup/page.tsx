"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function SignupPage() {
  const [form, setForm] = useState({
    clubName: "",
    contactName: "",
    email: "",
    phone: "",
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!acceptedTerms) {
      setStatus("Je moet akkoord gaan met de voorwaarden.");
      return;
    }

    if (loading) return;

    setLoading(true);
    setStatus("Aanmelding verwerken...");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error ?? "Aanmelding mislukt");
        setLoading(false);
        return;
      }

      setStatus("Gelukt! Je wordt doorgestuurd...");

      setTimeout(() => {
        window.location.href = "/login?welcome=true";
      }, 1000);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setStatus("Er ging iets mis. Probeer het later opnieuw.");
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen flex items-center justify-center bg-[#0d1b2a] p-6 pt-32">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl space-y-5"
        >

          {/* HEADLINE */}
          <div className="text-center space-y-2">
            <h1 className="text-xl font-semibold">
              Start met Sponsorjobs
            </h1>

            <p className="text-sm text-gray-600">
              Genereer nieuwe sponsorinkomsten met vacatures
            </p>

            <p className="text-sm font-semibold text-[#1f9d55]">
              🚀 2 maanden gratis toegang
            </p>
          </div>

          {/* USP BLOCK */}
          <div className="bg-gray-50 border rounded-lg p-3 text-xs text-gray-600 space-y-1">
            <p>✔ Nieuwe sponsorpropositie voor je club</p>
            <p>✔ Vacatures zichtbaar voor je netwerk</p>
            <p>✔ Binnen 10 minuten live</p>
          </div>

          {/* INPUTS */}

<div className="space-y-3">

  {/* Clubnaam */}
  <div className="space-y-1">
    <label className="text-xs text-gray-500">
      Clubnaam
    </label>
    <input
      required
      placeholder="Bijv. FC 's-Gravenzande"
      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-[#0d1b2a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d1b2a]"
      value={form.clubName}
      onChange={(e) =>
        setForm({ ...form, clubName: e.target.value })
      }
    />
  </div>

  {/* Contactpersoon */}
  <div className="space-y-1">
    <label className="text-xs text-gray-500">
      Naam contactpersoon
    </label>
    <input
      required
      placeholder="Bijv. Jan de Vries"
      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-[#0d1b2a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d1b2a]"
      value={form.contactName}
      onChange={(e) =>
        setForm({ ...form, contactName: e.target.value })
      }
    />
  </div>

  {/* Email */}
  <div className="space-y-1">
    <label className="text-xs text-gray-500">
      E-mailadres
    </label>
    <input
      type="email"
      required
      placeholder="contact@club.nl"
      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-[#0d1b2a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d1b2a]"
      value={form.email}
      onChange={(e) =>
        setForm({ ...form, email: e.target.value })
      }
    />
  </div>

  {/* Telefoon */}
  <div className="space-y-1">
    <label className="text-xs text-gray-500">
      Telefoonnummer (optioneel)
    </label>
    <input
      placeholder="06 12345678"
      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-[#0d1b2a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d1b2a]"
      value={form.phone}
      onChange={(e) =>
        setForm({ ...form, phone: e.target.value })
      }
    />
  </div>

</div>

          {/* TRUST TEXT */}
          <p className="text-xs text-gray-400 text-center">
            Geen verplichtingen • Direct toegang • Persoonlijke onboarding
          </p>

          {/* TERMS */}
          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              required
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1"
            />

            <span>
              Ik ga akkoord met de{" "}
              <a href="/privacy" className="underline" target="_blank">
                privacyverklaring
              </a>,{" "}
              <a href="/cookies" className="underline" target="_blank">
                cookiebeleid
              </a>{" "}
              en{" "}
              <a href="/terms" className="underline" target="_blank">
                platformvoorwaarden
              </a>.
            </span>
          </label>

          {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              loading
                ? "bg-gray-400"
                : "bg-[#1f9d55] hover:bg-[#15803d]"
            }`}
          >
            {loading
              ? "Bezig…"
              : "Start gratis (2 maanden)"}
          </button>

          {/* STATUS */}
          {status && (
            <p className="text-sm text-center text-gray-600">
              {status}
            </p>
          )}

          {/* LOGIN LINK */}

            <div className="pt-4 border-t border-gray-200 text-center space-y-2">

  <p className="text-sm text-gray-600">
    Heb je al een account?
  </p>

  <a
    href="/login"
    className="block w-full py-2 rounded-xl bg-[#0d1b2a] text-white font-semibold hover:bg-[#132a44] transition"
  >
    Ga naar login
  </a>

</div>

        </form>
      </main>
    </>
  );
}