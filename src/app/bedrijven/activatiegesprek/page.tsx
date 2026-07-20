"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ActivatieGesprekPage() {
  const [loading, setLoading] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [vacancies, setVacancies] = useState("");
  const [currentSponsor, setCurrentSponsor] = useState("");
  const [interest, setInterest] = useState("");
  const [notes, setNotes] = useState("");

  async function submit() {
    if (
      !companyName ||
      !contactName ||
      !email ||
      !phone
    ) {
      alert("Vul alle verplichte velden in.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "/api/contact/activatiegesprek",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName,
            contactName,
            email,
            phone,
            website,
            vacancies,
            currentSponsor,
            interest,
            notes,
          }),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      window.location.href =
        "/bedrijven/activatiegesprek/bedankt";
    } catch {
      alert("Er ging iets mis.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0d1b2a] text-white">

      {/* HERO */}

      <section className="max-w-6xl mx-auto px-6 pt-32 pb-24 text-center">

        <h1 className="text-5xl font-bold leading-tight">
          Plan jouw vrijblijvende
          <br />
          activatiegesprek
        </h1>

        <p className="mt-8 text-lg text-white/75 max-w-3xl mx-auto">
          Ontdek hoe jouw sponsoring kan bijdragen aan het
          aantrekken van lokaal talent. Tijdens een
          vrijblijvend gesprek laten we zien hoe
          Sponsorjobs jouw vacatures zichtbaar maakt
          binnen sportverenigingen én hoe je meer
          rendement haalt uit je sponsorinvestering.
        </p>

        <Link href="#formulier">
          <Button className="mt-10 bg-[#1f9d55] hover:bg-[#15803d] rounded-2xl px-8 py-6 text-lg">
            Plan mijn gesprek
          </Button>
        </Link>

      </section>

      {/* WAAROM */}

      <section className="bg-white text-black py-24">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center">
            Waarom een activatiegesprek?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">

            <div className="rounded-2xl border p-8">
              <h3 className="font-semibold text-xl">
                🎯 Bereik lokaal talent
              </h3>

              <p className="mt-4 text-gray-600">
                Ontdek welke verenigingen aansluiten
                bij jouw doelgroep.
              </p>
            </div>

            <div className="rounded-2xl border p-8">
              <h3 className="font-semibold text-xl">
                📈 Meer rendement
              </h3>

              <p className="mt-4 text-gray-600">
                Maak van sponsoring een
                recruitmentkanaal.
              </p>
            </div>

            <div className="rounded-2xl border p-8">
              <h3 className="font-semibold text-xl">
                🤝 Advies op maat
              </h3>

              <p className="mt-4 text-gray-600">
                Samen bepalen we de beste
                activatie voor jouw organisatie.
              </p>
            </div>

            <div className="rounded-2xl border p-8">
              <h3 className="font-semibold text-xl">
                🚀 Direct toepasbaar
              </h3>

              <p className="mt-4 text-gray-600">
                Je ontvangt concrete ideeën
                waarmee je direct verder kunt.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* STAPPEN */}

      <section className="py-24">

        <div className="max-w-5xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center">
            Hoe verloopt het gesprek?
          </h2>

          <div className="mt-16 grid md:grid-cols-4 gap-8 text-center">

            <div>
              <div className="text-5xl font-bold text-[#1f9d55]">
                1
              </div>

              <h3 className="mt-4 font-semibold">
                Kennismaking
              </h3>

              <p className="mt-3 text-white/70">
                We bespreken jouw organisatie.
              </p>
            </div>

            <div>
              <div className="text-5xl font-bold text-[#1f9d55]">
                2
              </div>

              <h3 className="mt-4 font-semibold">
                Analyse
              </h3>

              <p className="mt-3 text-white/70">
                We bekijken jouw vacatures en doelgroep.
              </p>
            </div>

            <div>
              <div className="text-5xl font-bold text-[#1f9d55]">
                3
              </div>

              <h3 className="mt-4 font-semibold">
                Activatievoorstel
              </h3>

              <p className="mt-3 text-white/70">
                We adviseren over de beste aanpak.
              </p>
            </div>

            <div>
              <div className="text-5xl font-bold text-[#1f9d55]">
                4
              </div>

              <h3 className="mt-4 font-semibold">
                Aan de slag
              </h3>

              <p className="mt-3 text-white/70">
                Jij bepaalt of je wilt starten.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* FORMULIER */}

      <section
        id="formulier"
        className="bg-white text-black py-24"
      >
        <div className="max-w-3xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center">
            Plan jouw activatiegesprek
          </h2>

          <p className="mt-5 text-center text-gray-600">
            Laat je gegevens achter.
            We nemen binnen één werkdag contact op.
          </p>

          <div className="grid md:grid-cols-2 gap-5 mt-12">

            <Input
              placeholder="Bedrijfsnaam *"
              value={companyName}
              onChange={(e) =>
                setCompanyName(e.target.value)
              }
            />

            <Input
              placeholder="Contactpersoon *"
              value={contactName}
              onChange={(e) =>
                setContactName(e.target.value)
              }
            />

            <Input
              placeholder="E-mailadres *"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <Input
              placeholder="Telefoonnummer *"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />

            <Input
              placeholder="Website"
              value={website}
              onChange={(e) =>
                setWebsite(e.target.value)
              }
            />

            <Input
              placeholder="Aantal openstaande vacatures"
              value={vacancies}
              onChange={(e) =>
                setVacancies(e.target.value)
              }
            />

          </div>

          <Input
            className="mt-5"
            placeholder="Bij welke vereniging sponsor je momenteel?"
            value={currentSponsor}
            onChange={(e) =>
              setCurrentSponsor(e.target.value)
            }
          />

          <Input
            className="mt-5"
            placeholder="Waar ben je benieuwd naar?"
            value={interest}
            onChange={(e) =>
              setInterest(e.target.value)
            }
          />

          <Textarea
            className="mt-5"
            rows={5}
            placeholder="Extra toelichting"
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
          />

          <div className="text-center mt-10">

            <Button
              onClick={submit}
              disabled={loading}
              className="bg-[#1f9d55] hover:bg-[#15803d] rounded-2xl px-10 py-6"
            >
              {loading
                ? "Verzenden..."
                : "Plan mijn vrijblijvende activatiegesprek"}
            </Button>

          </div>

        </div>

      </section>

    </main>
  );
}