"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ContactPage() {
  const searchParams = useSearchParams();
  const pakket = searchParams.get("pakket") || "";

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        club: formData.get("club"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        pakket: formData.get("pakket"),
        message: formData.get("message"),
      }),
    });

    if (res.ok) {
      setSuccess(true);
    }

    setLoading(false);
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#0d1b2a] flex items-center justify-center text-white px-6">
        <div className="bg-[#0f2233] p-12 rounded-2xl text-center max-w-lg">
          <h1 className="text-3xl font-bold">Aanvraag ontvangen</h1>
          <p className="mt-4 opacity-80">
            We nemen zo spoedig mogelijk contact met jullie op.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d1b2a] text-white py-24">
      <div className="max-w-2xl mx-auto px-6">

        <div className="bg-[#0f2233] rounded-2xl p-10 shadow-xl">

          <h1 className="text-3xl font-bold text-center">
            Aanvraag {pakket.toUpperCase()}
          </h1>

          <p className="mt-4 text-center opacity-70 text-sm">
            Vul onderstaande gegevens in en wij nemen contact met jullie op.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">

            <input name="pakket" defaultValue={pakket} type="hidden" />

            <div>
              <label className="text-sm opacity-70">Naam</label>
              <input
                name="name"
                required
                className="mt-2 w-full px-4 py-3 rounded-xl bg-white text-black"
              />
            </div>

            <div>
              <label className="text-sm opacity-70">Clubnaam</label>
              <input
                name="club"
                required
                className="mt-2 w-full px-4 py-3 rounded-xl bg-white text-black"
              />
            </div>

            <div>
              <label className="text-sm opacity-70">E-mailadres</label>
              <input
                type="email"
                name="email"
                required
                className="mt-2 w-full px-4 py-3 rounded-xl bg-white text-black"
              />
            </div>

            <div>
              <label className="text-sm opacity-70">Telefoonnummer</label>
              <input
                name="phone"
                className="mt-2 w-full px-4 py-3 rounded-xl bg-white text-black"
              />
            </div>

            <div>
              <label className="text-sm opacity-70">
                Korte toelichting
              </label>
              <textarea
                name="message"
                rows={4}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-white text-black"
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#1f9d55] py-4 rounded-xl font-semibold hover:bg-[#15803d] transition"
            >
              {loading ? "Versturen..." : "Aanvraag versturen"}
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}