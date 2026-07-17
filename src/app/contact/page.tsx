"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
          <h1 className="text-3xl font-bold">
  Bedankt voor jullie aanvraag!
</h1>

<p className="mt-4 opacity-80">
  We hebben een bevestiging gestuurd naar het opgegeven e-mailadres.
</p>

<p className="mt-2 opacity-80">
  Binnen 3 werkdagen nemen wij contact met jullie op.
</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d1b2a] flex justify-center px-6 pt-32 pb-16">
      <div className="w-full max-w-2xl">

        <div className="bg-[#0f2233] rounded-2xl p-10 shadow-xl">

          <h1 className="text-3xl font-bold text-center">
  {pakket
    ? `Aanvraag ${pakket.toUpperCase()}`
    : "Plan een demo"}
</h1>

<p className="mt-4 text-center opacity-70 text-sm">
  {pakket
    ? "Vul onderstaande gegevens in en wij nemen contact met jullie op."
    : "Benieuwd hoe Sponsorjobs werkt? Plan vrijblijvend een demo en ontdek hoe jouw vereniging extra sponsorwaarde kan creëren."}
</p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">

            <input name="pakket" defaultValue={pakket} type="hidden" />

            <div>
              <Label>Naam</Label>
              <Input
  name="name"
  required
/>
            </div>

            <div>
              <Label>Clubnaam</Label>
              <Input
  name="club"
  required
/>
            </div>

            <div>
              <Label>E-mailadres</Label>
              <Input
  type="email"
  name="email"
  required
/>
            </div>

            <div>
              <Label>Telefoonnummer</Label>
              <Input
  name="phone"
/>
            </div>

            <div>
              <Label>Korte toelichting</Label>
              <Textarea
  name="message"
  rows={4}
/>
            </div>

            <Button
  type="submit"
  className="w-full"
  disabled={loading}
>
  {loading ? "Versturen..." : "Aanvraag versturen"}
</Button>
          </form>

        </div>
      </div>
    </main>
  );
}