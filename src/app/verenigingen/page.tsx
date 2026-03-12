import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function VerenigingenPage() {
  return (
    <main className="min-h-screen bg-[#0d1b2a] text-white pt-28">

      <Navbar />

      {/* HERO */}
<section className="relative flex items-center justify-center min-h-[50vh] text-center px-6 pt-32 pb-16">

  <div className="max-w-4xl mx-auto pt-12">

    <Image
      src="/logo/sponsorjobs-light.png"
      alt="SponsorJobs"
      width={520}
      height={200}
      className="mx-auto mb-8"
    />

    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
      Maak vacatures onderdeel van je sponsorpropositie.
    </h1>

    <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
      Het recruitmentplatform voor sportverenigingen.
      Maak vacatures onderdeel van je sponsorpropositie
      en creëer een nieuwe structurele inkomstenstroom.
    </p>

    <div className="mt-10">
      <Link
        href="/signup"
        className="bg-[#1f9d55] px-8 py-4 rounded-2xl font-semibold hover:bg-[#15803d] transition shadow-lg"
      >
        Start met Sponsorjobs
      </Link>
    </div>

    {/* TRUST BULLETS */}
    <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-white/70">

      <div className="flex items-center gap-2">
        <span className="text-green-400">✓</span>
        Binnen 5 minuten live
      </div>

      <div className="flex items-center gap-2">
        <span className="text-green-400">✓</span>
        Nieuwe structurele sponsorinkomsten
      </div>

      <div className="flex items-center gap-2">
        <span className="text-green-400">✓</span>
        Recruitment via je clubnetwerk
      </div>

    </div>

  </div>

</section>

<section className="bg-white text-black py-12">
  <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">

    <div>
      <h2 className="text-2xl font-bold">
        Sponsoring levert vaak alleen zichtbaarheid op.
      </h2>

      <p className="mt-4 text-gray-600">
        Bedrijven zoeken personeel. Clubs zoeken duurzame sponsoring.
        Toch blijven beide werelden vaak los van elkaar.
      </p>
    </div>

    <div>
      <h2 className="text-2xl font-bold">
        SponsorJobs verbindt die werelden.
      </h2>

      <p className="mt-4 text-gray-600">
        Vacatures van sponsoren worden zichtbaar binnen het clubnetwerk.
        Zo wordt sponsoring ook een recruitmentkanaal.
      </p>
    </div>

  </div>
</section>

      {/* HOE WERKT HET */}
      <section className="bg-white text-black py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold">
            Hoe werkt SponsorJobs?
          </h2>

          <p className="mt-6 opacity-70">
            Vacatures worden onderdeel van het sponsorpakket.
            Sponsors kunnen hun vacatures plaatsen en extra zichtbaarheid kopen.
          </p>

          <div className="mt-16 grid md:grid-cols-3 gap-10 text-left">

            <div className="bg-slate-50 p-8 rounded-2xl">
              <h3 className="font-semibold text-lg">
                Vacature als sponsoractivatie
              </h3>
              <p className="mt-3 text-sm opacity-70">
                Neem vacatureplaatsing op in je sponsorpakket
                of verkoop deze als losse commerciële upgrade.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl">
              <h3 className="font-semibold text-lg">
                Highlight advertenties
              </h3>
              <p className="mt-3 text-sm opacity-70">
                Sponsors kunnen tegen betaling bovenaan de pagina staan
                of extra promotie krijgen.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl">
              <h3 className="font-semibold text-lg">
                Maandelijkse rapportage
              </h3>
              <p className="mt-3 text-sm opacity-70">
                Clubs en sponsors ontvangen inzicht in bereik,
                clicks en groei.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* REKENVOORBEELD */}
      <section className="py-24 bg-[#0f2233]">
        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold">
            Wat levert dit de club concreet op?
          </h2>

          <div className="mt-12 bg-white text-black rounded-2xl p-10 text-left shadow-xl">

            <p className="text-lg font-semibold mb-6">
              Rekenvoorbeeld (conservatief):
            </p>

            <ul className="space-y-4 text-sm">
              <li>• 3 sponsoren kopen een highlight advertentie voor €500 per seizoen per sponsor</li>
              <li>• 5 sponsoren kopen 1 reguliere vacature voor €250 per seizoen per sponsor</li>
              <li>• Totaal extra inkomsten: <strong>€2.750</strong></li>
            </ul>

            <div className="mt-8 p-6 bg-green-50 rounded-xl">
              <p className="font-semibold text-green-700">
                Resultaat:
              </p>
              <p className="mt-2 text-sm">
                Zelfs met een Pro-abonnement houd je meer dan €1.800 over.
              </p>
            </div>

            <p className="mt-6 text-sm opacity-70">
              Dit is zonder extra social activatie,
              zonder recruitmentcampagnes,
              zonder aanvullende sponsorupsells.
            </p>

            <div className="mt-8 p-6 bg-green-50 rounded-xl">
              <p className="font-semibold text-green-700">
                Recruitment via de community van jouw sportvereniging.
              </p>
              <p className="mt-2 text-sm">
                De activatiemogelijkheden zijn eindeloos en Sponsorjobs is een nieuwe onderdeel van jouw sponsorpropositie. Met de sportmarketing ervaring van Sponsorjobs vertellen we je hier graag vrijblijvend meer over.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* LAUNCH PARTNERS */}
<section className="bg-white text-black py-24">
  <div className="max-w-5xl mx-auto px-6 text-center">

    <h2 className="text-3xl font-bold">
      Launch partners van SponsorJobs
    </h2>

    <p className="mt-6 max-w-2xl mx-auto opacity-70">
      SponsorJobs wordt momenteel gelanceerd bij een eerste groep sportverenigingen.
      Voor deze launchfase zoeken we <strong>10 clubs</strong> die recruitment
      onderdeel willen maken van hun sponsorpropositie.
    </p>

    <div className="mt-12 bg-slate-50 rounded-2xl p-10 text-left shadow-xl">

      <p className="text-lg font-semibold mb-6">
        Launch partners ontvangen:
      </p>

      <ul className="space-y-4 text-sm">
        <li>✓ Toegang tot het <strong>Pro pakket van SponsorJobs</strong></li>
        <li>✓ <strong>€39 per maand</strong> (normaal €79)</li>
        <li>✓ <strong>Lifetime prijs</strong> zolang de club actief blijft</li>
        <li>✓ Persoonlijke onboarding en ondersteuning</li>
        <li>✓ Invloed op nieuwe features en platformontwikkeling</li>
      </ul>

      <div className="mt-8 p-6 bg-green-50 rounded-xl">
        <p className="font-semibold text-green-700">
          Er zijn momenteel nog 5 launch partner plekken beschikbaar.
        </p>
        <p className="mt-2 text-sm">
          Clubs die nu aansluiten profiteren van het volledige Pro pakket
          tegen een gereduceerd tarief.
        </p>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/signup"
          className="bg-[#1f9d55] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#15803d] transition"
        >
          Word launch partner
        </Link>
      </div>

    </div>

  </div>
</section>

      {/* PLATFORM ABONNEMENTEN */}
<section className="py-24">
  <div className="max-w-7xl mx-auto px-6 text-center">

    <h2 className="text-3xl font-bold">
      Platform Abonnementen
    </h2>

    <p className="mt-6 opacity-70">
      Start gratis en schaal op wanneer je sponsoractivatie groeit.
    </p>

    <div className="mt-16 grid md:grid-cols-4 gap-8 text-left">

      {/* BASIC */}
      <div className="border border-white/20 rounded-2xl p-8 flex flex-col h-full">
        <h3 className="text-xl font-semibold">Basic</h3>

        <p className="mt-4 text-4xl font-bold">€0</p>
        <p className="text-sm opacity-60">2 maanden proef</p>

        <ul className="mt-6 space-y-3 text-sm opacity-80">
          <li>✓ Geen advertentiemogelijkheden</li>
          <li>✓ 2 maanden proefversie</li>
          <li>✓ Maandelijkse mailrapportage</li>
          <li>✓ Sponsor dashboard</li>
        </ul>

       <div className="mt-auto pt-12">
  <Link
    href="/signup"
    className="block bg-white text-black py-3 rounded-xl text-center font-medium"
  >
    Start Basic
  </Link>
</div>
</div>


      {/* PLUS */}
      <div className="border-2 border-[#1f9d55] bg-[#0f2233] rounded-2xl p-8 flex flex-col h-full relative shadow-lg">

        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1f9d55] text-white text-xs px-3 py-1 rounded-full">
          Meest gekozen
        </div>

        <h3 className="text-xl font-semibold text-[#1f9d55]">
          Plus
        </h3>

        <p className="mt-4 text-4xl font-bold text-[#1f9d55]">€49</p>
        <p className="text-sm opacity-60">per maand</p>

        <ul className="mt-6 space-y-3 text-sm opacity-80">
          <li>✓ 1 highlight advertentie</li>
          <li>✓ Maandelijkse mailrapportage</li>
          <li>✓ Sponsor dashboard</li>
        </ul>

        <div className="mt-auto pt-12">
  <Link
    href="/signup"
    className="block bg-[#1f9d55] text-white py-3 rounded-xl text-center font-medium hover:bg-[#15803d] transition"
  >
    Start Plus
  </Link>
</div>
      </div>


      {/* PRO */}
      <div className="border border-white/20 rounded-2xl p-8 flex flex-col h-full">
        <h3 className="text-xl font-semibold">Pro</h3>

        <p className="mt-4 text-4xl font-bold">€79</p>
        <p className="text-sm opacity-60">per maand</p>

        <ul className="mt-6 space-y-3 text-sm opacity-80">
          <li>✓ 3 highlight advertenties</li>
          <li>✓ Maandelijkse mailrapportage</li>
          <li>✓ Sponsor dashboard</li>
        </ul>

        <div className="mt-auto pt-12">
  <Link
    href="/signup"
    className="block bg-white text-black py-3 rounded-xl text-center font-medium"
  >
    Start Pro
  </Link>
</div>
      </div>


      {/* UNLIMITED */}
      <div className="border border-yellow-400 rounded-2xl p-8 flex flex-col h-full shadow-xl">
        <h3 className="text-xl font-semibold text-yellow-400">
          Unlimited
        </h3>

        <p className="mt-4 text-4xl font-bold text-yellow-400">€99</p>
        <p className="text-sm opacity-60">per maand</p>

        <ul className="mt-6 space-y-3 text-sm opacity-80">
          <li>✓ Ongelimiteerd highlight advertenties</li>
          <li>✓ Maandelijkse mailrapportage</li>
          <li>✓ Sponsor dashboard</li>
        </ul>

        <div className="mt-auto pt-12">
  <Link
    href="/signup"
    className="block bg-yellow-400 text-black py-3 rounded-xl text-center font-medium hover:bg-yellow-300 transition"
  >
    Start Unlimited
  </Link>

</div>
      </div>

    </div>

    <p className="mt-12 text-white/70">
Wil je vacatures van sponsoren ook actief promoten via social media en recruitmentcampagnes?
</p>

<Link
href="/activatie"
className="text-[#1f9d55] font-semibold hover:underline"
>
Bekijk activatie mogelijkheden →
</Link>

  </div>

</section>

    </main>
  );
}
