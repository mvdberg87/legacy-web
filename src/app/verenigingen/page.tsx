import Link from "next/link";

export default function VerenigingenPage() {
  return (
    <main className="min-h-screen bg-[#0d1b2a] text-white">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          SponsorJobs
        </h1>

        <p className="mt-6 max-w-2xl mx-auto opacity-80 text-lg">
          Het recruitmentplatform voor sportverenigingen.
          Maak vacatures onderdeel van je sponsorpropositie
          en creëer een nieuwe structurele inkomstenstroom.
        </p>

        <div className="mt-10">
          <Link
            href="/signup"
            className="bg-[#1f9d55] px-8 py-4 rounded-2xl font-semibold hover:bg-[#15803d] transition"
          >
            Plan een kennismaking
          </Link>
        </div>
      </section>

      {/* HOE WERKT HET */}
      <section className="bg-white text-black py-24">
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
              <li>• 3 sponsoren kopen een highlight advertentie</li>
              <li>• €500 per seizoen per sponsor</li>
              <li>• Totaal extra inkomsten: <strong>€1.500</strong></li>
            </ul>

            <div className="mt-8 p-6 bg-green-50 rounded-xl">
              <p className="font-semibold text-green-700">
                Resultaat:
              </p>
              <p className="mt-2 text-sm">
                Zelfs met een Plus-abonnement houd je al bijna €800 over.
              </p>
            </div>

            <p className="mt-6 text-sm opacity-70">
              Dit is zonder extra social activatie,
              zonder recruitmentcampagnes,
              zonder aanvullende sponsorupsells.
            </p>

          </div>

        </div>
      </section>

      {/* PLATFORM ABONNEMENTEN */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold">
            Platform Abonnementen
          </h2>

          <p className="mt-6 opacity-70">
            Kies het pakket dat past bij de ambitie van jouw vereniging.
          </p>

          <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">

            {/* BASIC */}
            <div className="border border-white/20 rounded-2xl p-8">
              <h3 className="text-xl font-semibold">Basic</h3>
              <p className="mt-4 text-4xl font-bold">€29</p>
              <p className="text-sm opacity-60">per maand</p>

              <ul className="mt-6 space-y-3 text-sm opacity-80">
                <li>✓ 1 actieve vacature</li>
                <li>✓ Basis rapportage</li>
                <li>✓ Sponsor dashboard</li>
              </ul>

              <Link
                href="/signup"
                className="block mt-8 bg-white text-black py-3 rounded-xl text-center font-medium"
              >
                Start Basic
              </Link>
            </div>

            {/* PLUS */}
            <div className="border-2 border-[#1f9d55] bg-[#0f2233] rounded-2xl p-8 relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1f9d55] text-white text-xs px-3 py-1 rounded-full">
                Meest gekozen
              </div>

              <h3 className="text-xl font-semibold text-[#1f9d55]">Plus</h3>
              <p className="mt-4 text-4xl font-bold text-[#1f9d55]">€49</p>
              <p className="text-sm opacity-60">per maand</p>

              <ul className="mt-6 space-y-3 text-sm opacity-80">
                <li>✓ 5 actieve vacatures</li>
                <li>✓ Highlight advertenties</li>
                <li>✓ Uitgebreide rapportage</li>
                <li>✓ Maandelijkse mailrapportage</li>
              </ul>

              <Link
                href="/signup"
                className="block mt-8 bg-[#1f9d55] text-white py-3 rounded-xl text-center font-medium"
              >
                Start Plus
              </Link>
            </div>

            {/* PRO */}
            <div className="border border-white/20 rounded-2xl p-8">
              <h3 className="text-xl font-semibold">Pro</h3>
              <p className="mt-4 text-4xl font-bold">€79</p>
              <p className="text-sm opacity-60">per maand</p>

              <ul className="mt-6 space-y-3 text-sm opacity-80">
                <li>✓ Onbeperkt vacatures</li>
                <li>✓ Meerdere highlights</li>
                <li>✓ Strategische rapportage</li>
                <li>✓ Club branding</li>
              </ul>

              <Link
                href="/signup"
                className="block mt-8 bg-white text-black py-3 rounded-xl text-center font-medium"
              >
                Start Pro
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ACTIVATIE PAKKETTEN */}
      <section className="py-24 bg-[#0f2233]">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold text-white">
            Activatie Pakketten
          </h2>

          <p className="mt-6 opacity-70 max-w-2xl mx-auto">
            Voor verenigingen die méér uit hun sponsoren willen halen.
            Wij verzorgen de content, activatie en recruitmentversterking.
          </p>

          <div className="mt-16 grid md:grid-cols-4 gap-8 text-left">

            {/* ACTIVATE */}
            <div className="bg-white text-black rounded-2xl p-8 shadow">
              <h3 className="text-lg font-semibold text-green-600">
                ACTIVATE
              </h3>

              <p className="mt-4 text-3xl font-bold">€300</p>
              <p className="text-sm opacity-60">per maand</p>

              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ 1 post per week</li>
                <li>✓ LinkedIn, Instagram & Facebook</li>
                <li>✓ Vacature spotlight</li>
                <li>✓ Standaard template visuals</li>
                <li>✓ Korte maandupdate</li>
              </ul>

              <p className="mt-6 text-xs opacity-60">
                Voor sponsoren die zichtbaar willen zijn.
              </p>

              <Link
                href="/signup"
                className="block mt-8 bg-[#1f9d55] text-white py-3 rounded-xl text-center font-medium"
              >
                Start Activate
              </Link>
            </div>


            {/* GROWTH */}
            <div className="bg-white text-black rounded-2xl p-8 shadow border-2 border-yellow-400 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full">
                Meest gekozen
              </div>

              <h3 className="text-lg font-semibold text-yellow-500">
                GROWTH
              </h3>

              <p className="mt-4 text-3xl font-bold">€750</p>
              <p className="text-sm opacity-60">per maand</p>

              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ 2 posts per week</li>
                <li>✓ LinkedIn, Instagram & Facebook</li>
                <li>✓ 1 maandelijkse meeting</li>
                <li>✓ Vacature-campagne op maat</li>
                <li>✓ Uitgebreide maandrapportage</li>
                <li>✓ Sponsor in the spotlight</li>
              </ul>

              <p className="mt-6 text-xs opacity-60">
                Voor sponsoren die recruitment serieus nemen.
              </p>

              <Link
                href="/signup"
                className="block mt-8 bg-yellow-400 text-black py-3 rounded-xl text-center font-medium"
              >
                Start Growth
              </Link>
            </div>


            {/* PREMIUM */}
            <div className="bg-white text-black rounded-2xl p-8 shadow">
              <h3 className="text-lg font-semibold text-blue-600">
                PREMIUM
              </h3>

              <p className="mt-4 text-3xl font-bold">€1.350</p>
              <p className="text-sm opacity-60">per maand</p>

              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ Alles van Growth</li>
                <li>✓ 2 video’s per maand (op locatie)</li>
                <li>✓ Uitgelichte advertentiecampagne</li>
                <li>✓ Contentstrategie per sponsor</li>
                <li>✓ Maandelijkse strategische sessie</li>
              </ul>

              <p className="mt-6 text-xs opacity-60">
                Dit is waar je écht impact maakt.
              </p>

              <Link
                href="/signup"
                className="block mt-8 bg-blue-600 text-white py-3 rounded-xl text-center font-medium"
              >
                Start Premium
              </Link>
            </div>


            {/* ELITE */}
            <div className="bg-white text-black rounded-2xl p-8 shadow">
              <h3 className="text-lg font-semibold text-purple-600">
                ELITE
              </h3>

              <p className="mt-4 text-3xl font-bold">€1.750</p>
              <p className="text-sm opacity-60">per maand</p>

              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ Alles van Premium</li>
                <li>✓ Maandelijks nieuwe foto’s & video’s</li>
                <li>✓ Dedicated social media manager</li>
                <li>✓ Rapportage op maat</li>
                <li>✓ Extra campagne rondom events</li>
                <li>✓ Recruitmentcampagne ondersteuning</li>
              </ul>

              <p className="mt-6 text-xs opacity-60">
                High-end sponsoractivatie.
              </p>

              <Link
                href="/signup"
                className="block mt-8 bg-purple-600 text-white py-3 rounded-xl text-center font-medium"
              >
                Start Elite
              </Link>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}
