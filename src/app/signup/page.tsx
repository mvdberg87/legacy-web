// src/app/signup/page.tsx

"use client";

import { useState } from "react";

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

      setStatus(
  "Bedankt voor je aanmelding. We beoordelen je aanvraag en nemen snel contact op voor de activatie van jullie club."
);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setStatus("Er ging iets mis. Probeer het later opnieuw.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0d1b2a] p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border-2 border-white rounded-2xl p-8 shadow-xl space-y-5"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-lg font-bold text-[#0d1b2a]">
            WELKOM BIJ SPONSORJOBS
          </h2>

          <h1 className="text-xl font-semibold">
            Club aanmelden
          </h1>

          <p className="text-sm text-gray-600">
  Meld je club aan en verbind sponsoren, vacatures en talent
  binnen jullie netwerk.
</p>

<p className="text-xs text-gray-500">
  Aanmelden duurt minder dan 1 minuut.
</p>

<p className="text-xs text-gray-500">
  Na je aanmelding nemen we persoonlijk contact op om jullie club te activeren.
</p>
        </div>

        {/* Inputs */}
        <input
          required
          placeholder="Clubnaam"
          className="w-full border rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d1b2a]"
          value={form.clubName}
          onChange={(e) =>
            setForm({ ...form, clubName: e.target.value })
          }
        />

        <input
          required
          placeholder="Naam contactpersoon"
          className="w-full border rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d1b2a]"
          value={form.contactName}
          onChange={(e) =>
            setForm({ ...form, contactName: e.target.value })
          }
        />

        <input
          type="email"
          required
          placeholder="E-mailadres"
          className="w-full border rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d1b2a]"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
  placeholder="Telefoonnummer"
  className="w-full border rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d1b2a]"
  value={form.phone}
  onChange={(e) =>
    setForm({ ...form, phone: e.target.value })
  }
/>

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
    <a href="/privacy" className="underline">privacyverklaring</a>,{" "}
    <a href="/cookies" className="underline">cookiebeleid</a> en{" "}
    <a href="/terms" className="underline">platformvoorwaarden</a>.
  </span>
</label>

        {/* CTA */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-white transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1f9d55] hover:bg-[#15803d]"
            }`}
        >
          {loading ? "Bezig…" : "Club aanmelden"}
        </button>

        {/* Status */}
        {status && (
          <p className="text-sm text-center text-gray-600">
            {status}
          </p>
        )}
      </form>
    </main>
  );
}
