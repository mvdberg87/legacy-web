"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { toast } from "sonner";

const supabase = getSupabaseBrowser();

type Club = {
  id: string;
  name: string;
  slug: string;
  primary_color?: string;
};

export default function ActivatiePage() {

  const [clubs, setClubs] = useState<Club[]>([]);

  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
const [selectedPackage, setSelectedPackage] = useState<
  "partner" | "spotlight" | "premium" | null
>(null);

const [companyName, setCompanyName] = useState("");
const [contactName, setContactName] = useState("");
const [companyEmail, setCompanyEmail] = useState("");
const [companyWebsite, setCompanyWebsite] = useState("");
const [vacancyUrl, setVacancyUrl] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");
const [notes, setNotes] = useState("");

const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchClubs();
}, []);

const fetchClubs = async () => {

  const { data, error } = await supabase
  .from("clubs")
  .select(
    "id, name, slug, primary_color, status, advertising_sales_enabled"
  )
  .eq("advertising_sales_enabled", true)
  .order("name");

  console.log("CLUBS", data);
console.log("ERROR", error);

  if (error) {
    console.error(error);
    return;
  }

  setClubs(data || []);

  console.log("CLUBS", data);
};

const packagePrices = {
  partner: 350,
  spotlight: 750,
  premium: 1250,
};

const totalPrice = useMemo(() => {
  if (!selectedPackage) return 0;

  console.log(
  "Aantal clubs:",
  clubs.length
);

  return (
    selectedClubs.length *
    packagePrices[selectedPackage]
  );
}, [selectedClubs, selectedPackage]);

const toggleClub = (clubId: string) => {
  setSelectedClubs((prev) =>
    prev.includes(clubId)
      ? prev.filter((id) => id !== clubId)
      : [...prev, clubId]
  );
};

const startCheckout = async () => {

  if (
    !selectedPackage ||
    selectedClubs.length === 0 ||
    !companyName ||
    !contactName ||
    !companyEmail ||
    !companyWebsite ||
    !vacancyUrl
  ) {
    toast.error("Vul alle verplichte velden in.");
    return;
  }

  try {

    setLoading(true);

    const res = await fetch(
      "/api/stripe/company-checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clubIds: selectedClubs,
          packageKey: selectedPackage,

          companyName,
          contactName,
          companyEmail,
          companyWebsite,
          vacancyUrl,
          phoneNumber,
          notes,
        }),
      }
    );

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    toast.error("Checkout kon niet worden gestart.");

  } catch (err) {

    console.error(err);

    toast.error("Er ging iets mis.");

  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-[#0d1b2a] text-white">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-24 text-center">

        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Vind personeel via de kracht van sportverenigingen.
        </h1>

        <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
          Maak jouw vacatures zichtbaar binnen het netwerk van lokale sportclubs en bereik actief werkzoekenden via community, social media en recruitment activatie.
        </p>

        <p className="mt-4 text-white/70 max-w-2xl mx-auto">
          Met de activatiepakketten van Sponsorjobs helpen we
          sportverenigingen om vacatures van sponsoren te promoten
          via social media, content en recruitmentcampagnes.
        </p>

      </section>


      {/* PROBLEEM / OPLOSSING */}
      <section className="bg-white text-black py-20">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          <div>
            <h2 className="text-2xl font-bold">
              Veel vacatures van sponsoren blijven onzichtbaar.
            </h2>

            <p className="mt-4 opacity-70">
              Sponsors hebben vacatures, maar deze bereiken vaak
              niet het netwerk van de club. Daardoor blijft een
              belangrijk onderdeel van sponsoractivatie onbenut.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0d1b2a]">
              Activatie maakt sponsoring meetbaar.
            </h2>

            <p className="mt-4 opacity-70">
              Door vacatures actief te promoten via social media,
              content en campagnes ontstaat extra zichtbaarheid
              voor sponsoren én een waardevolle recruitmentkans
              binnen de clubcommunity.
            </p>
          </div>

        </div>

      </section>


      {/* HOE HET WERKT */}
      <section className="py-24">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold">
            Hoe werkt sponsoractivatie?
          </h2>

          <div className="mt-16 grid md:grid-cols-4 gap-10">

            <div>
              <div className="text-4xl font-bold text-[#1f9d55]">01</div>
              <h3 className="mt-4 font-semibold text-lg">
                Vacature van sponsor
              </h3>
              <p className="mt-2 opacity-80 text-sm">
                De sponsor levert een vacature aan
                die binnen het clubnetwerk zichtbaar wordt.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-[#1f9d55]">02</div>
              <h3 className="mt-4 font-semibold text-lg">
                Content en promotie
              </h3>
              <p className="mt-2 opacity-80 text-sm">
                Vacatures worden gepromoot via social media,
                visuals en campagnes.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-[#1f9d55]">03</div>
              <h3 className="mt-4 font-semibold text-lg">
                Bereik binnen community
              </h3>
              <p className="mt-2 opacity-80 text-sm">
                Clubleden, supporters en netwerkpartners
                zien de vacatures via clubkanalen.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-[#1f9d55]">04</div>
              <h3 className="mt-4 font-semibold text-lg">
                Extra sponsorwaarde
              </h3>
              <p className="mt-2 opacity-80 text-sm">
                Sponsoring wordt meetbaar en
                recruitment wordt onderdeel van de activatie.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* CLUB SELECTIE */}
<section className="py-24 bg-[#10263a]">

  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center">

      <h2 className="text-3xl font-bold">
        Kies de verenigingen waar jouw vacatures zichtbaar worden
      </h2>

      <p className="mt-4 text-white/70">
  Hieronder staan uitsluitend verenigingen
  die deelnemen aan het Sponsorjobs
  Advertentienetwerk.
</p>

    </div>

    <div className="mt-14 grid md:grid-cols-3 gap-6">

      {clubs.map((club) => {

        const selected = selectedClubs.includes(club.id);

        return (
          <button
            key={club.id}
            onClick={() => toggleClub(club.id)}
            className={`
              rounded-2xl border p-6 text-left transition
              ${
                selected
                  ? "border-green-500 bg-green-500/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }
            `}
          >

            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-xl font-semibold">
                  {club.name}
                </h3>

              </div>

              <div
                className={`
                  w-6 h-6 rounded-full border-2
                  ${
                    selected
                      ? "bg-green-500 border-green-500"
                      : "border-white/30"
                  }
                `}
              />

            </div>

          </button>
        );
      })}

    </div>

  </div>

</section>


      {/* Recruitment PAKKETTEN */}
      <section className="py-24 bg-[#0f2233]">

        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold text-white">
            Recruitment Pakketten
          </h2>

          <p className="mt-6 text-white/70 max-w-2xl mx-auto">
            Bereik lokaal talent via sportverenigingen.
            Wij verzorgen de content, activatie en recruitmentversterking.
          </p>


<div className="mt-16 grid md:grid-cols-3 gap-8 text-left">


  {/* PARTNER */}
  <button
    onClick={() => setSelectedPackage("partner")}
    className={`
      rounded-2xl p-8 flex flex-col h-full shadow-xl transition
      ${
        selectedPackage === "partner"
          ? "bg-green-500 text-black"
          : "bg-white text-black hover:scale-[1.02]"
      }
    `}
  >

    <h3 className="font-semibold text-lg">
      Recruitment Partner
    </h3>

    <p className="mt-4 text-4xl font-bold">
      €350
    </p>

    <p className="text-sm opacity-70">
      per vereniging / jaar
    </p>

    <ul className="mt-6 space-y-3 text-sm">
      <li>✓ Vacature zichtbaar op SponsorJobs</li>
      <li>✓ Zichtbaarheid binnen clubnetwerk</li>
      <li>✓ Sponsorlogo zichtbaar</li>
      <li>✓ Dashboard & statistieken</li>
    </ul>

  </button>


  {/* SPOTLIGHT */}
  <button
    onClick={() => setSelectedPackage("spotlight")}
    className={`
      rounded-2xl p-8 flex flex-col h-full shadow-xl transition relative
      ${
        selectedPackage === "spotlight"
          ? "bg-yellow-400 text-black"
          : "bg-white text-black hover:scale-[1.02]"
      }
    `}
  >

    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded-full">
      Meest gekozen
    </div>

    <h3 className="font-semibold text-lg">
      Recruitment Spotlight
    </h3>

    <p className="mt-4 text-4xl font-bold">
      €750
    </p>

    <p className="text-sm opacity-70">
      per vereniging / jaar
    </p>

    <ul className="mt-6 space-y-3 text-sm">
      <li>✓ Alles uit Partner</li>
      <li>✓ Vacature in the Spotlight</li>
      <li>✓ Social media post via clubkanalen</li>
      <li>✓ Extra zichtbaarheid binnen campagnes</li>
    </ul>

  </button>


  {/* PREMIUM */}
  <button
    onClick={() => setSelectedPackage("premium")}
    className={`
      rounded-2xl p-8 flex flex-col h-full shadow-xl transition
      ${
        selectedPackage === "premium"
          ? "bg-blue-600 text-white"
          : "bg-white text-black hover:scale-[1.02]"
      }
    `}
  >

    <h3 className="font-semibold text-lg">
      Recruitment Premium
    </h3>

    <p className="mt-4 text-4xl font-bold">
      €1.250
    </p>

    <p className="text-sm opacity-70">
      per vereniging / jaar
    </p>

    <ul className="mt-6 space-y-3 text-sm">
      <li>✓ Alles uit Spotlight</li>
      <li>✓ Narrowcasting binnen vereniging</li>
      <li>✓ Vacatures aanpasbaar gedurende jaar</li>
      <li>✓ Extra activatiemomenten</li>
    </ul>

  </button>

</div>

<div className="mt-16 text-center">

  <p className="text-white/60 uppercase tracking-widest text-sm">
    Totale investering
  </p>

  <h3 className="mt-4 text-5xl font-bold text-white">
    €{totalPrice}
  </h3>

  <p className="mt-3 text-white/60">
    excl. BTW per jaar
  </p>

  <p className="mt-6 text-sm text-white/50">
    {selectedClubs.length} vereniging(en) geselecteerd
  </p>

</div>

<div className="mt-16 max-w-3xl mx-auto bg-white text-black rounded-2xl p-8">

  <h3 className="text-2xl font-bold">
    Bedrijfsgegevens
  </h3>

  <div className="grid md:grid-cols-2 gap-4 mt-6">

    <input
      value={companyName}
      onChange={(e) => setCompanyName(e.target.value)}
      placeholder="Bedrijfsnaam *"
      className="border rounded-xl p-3"
    />

    <input
      value={contactName}
      onChange={(e) => setContactName(e.target.value)}
      placeholder="Contactpersoon *"
      className="border rounded-xl p-3"
    />

    <input
      value={companyEmail}
      onChange={(e) => setCompanyEmail(e.target.value)}
      placeholder="E-mailadres *"
      className="border rounded-xl p-3"
    />

    <input
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.target.value)}
      placeholder="Telefoonnummer"
      className="border rounded-xl p-3"
    />

    <input
      value={companyWebsite}
      onChange={(e) => setCompanyWebsite(e.target.value)}
      placeholder="Website *"
      className="border rounded-xl p-3"
    />

    <input
      value={vacancyUrl}
      onChange={(e) => setVacancyUrl(e.target.value)}
      placeholder="Vacature URL *"
      className="border rounded-xl p-3"
    />

  </div>

  <textarea
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    placeholder="Extra toelichting"
    className="border rounded-xl p-3 w-full mt-4"
    rows={4}
  />

</div>

<div className="mt-10 text-center">

  <button
  onClick={startCheckout}
  disabled={
    loading ||
    !selectedPackage ||
    selectedClubs.length === 0
  }
  className="
    bg-[#1f9d55]
    px-10
    py-4
    rounded-2xl
    font-semibold
    hover:bg-[#15803d]
    transition
    disabled:opacity-40
    disabled:cursor-not-allowed
  "
>
  {loading
    ? "Bezig..."
    : "Start recruitmentcampagne"}
</button>

</div>

</div>

</section>

      {/* CTA */}
      <section className="py-24 text-center">

        <h2 className="text-3xl font-bold">
          Wil je meer halen uit je sponsoren?
        </h2>

        <p className="mt-6 text-white/70 max-w-xl mx-auto">
          Ontdek hoe sponsoractivatie en recruitment samen
          nieuwe waarde kunnen creëren voor jouw vereniging.
        </p>

        <div className="mt-10">

          <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">

  <Link
    href="/signup"
    className="bg-[#1f9d55] px-8 py-4 rounded-2xl font-semibold hover:bg-[#15803d] transition"
  >
    Start jouw recruitment activatie
  </Link>

  <Link
    href="/contact"
    target="_blank"
    rel="noopener noreferrer"
    className="border border-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-[#0d1b2a] transition"
  >
    Plan een activatiegesprek
  </Link>

</div>

        </div>

      </section>


    </main>
  );
}
