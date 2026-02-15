// src/app/signup/page.tsx

"use client";

import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    clubName: "",
    contactName: "",
    email: "",
  });

  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        "Bedankt voor je aanmelding. Check je mailbox voor de vervolgstappen."
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
