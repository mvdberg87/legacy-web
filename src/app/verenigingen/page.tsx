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

        <Link
          href="/signup"
          className="mt-auto bg-white text-black py-3 rounded-xl text-center font-medium"
        >
          Start Gratis
        </Link>
      </div>


      {/* PLUS */}
      <div className="border-2 border-[#1f9d55] bg-[#0f2233] rounded-2xl p-8 flex flex-col h-full relative shadow-lg">

        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1f9d55] text-white text-xs px-3 py-1 rounded-full">
          Meest gekozen
        </div>

        <h3 className="text-xl font-semibold text-[#1f9d55]">
          Plus
        </h3>

        <p className="mt-4 text-4xl font-bold text-[#1f9d55]">€29</p>
        <p className="text-sm opacity-60">per maand</p>

        <ul className="mt-6 space-y-3 text-sm opacity-80">
          <li>✓ 1 highlight advertentie</li>
          <li>✓ Maandelijkse mailrapportage</li>
          <li>✓ Sponsor dashboard</li>
        </ul>

        <Link
          href="/signup"
          className="mt-auto bg-[#1f9d55] text-white py-3 rounded-xl text-center font-medium"
        >
          Start Plus
        </Link>
      </div>


      {/* PRO */}
      <div className="border border-white/20 rounded-2xl p-8 flex flex-col h-full">
        <h3 className="text-xl font-semibold">Pro</h3>

        <p className="mt-4 text-4xl font-bold">€39</p>
        <p className="text-sm opacity-60">per maand</p>

        <ul className="mt-6 space-y-3 text-sm opacity-80">
          <li>✓ 3 highlight advertenties</li>
          <li>✓ Maandelijkse mailrapportage</li>
          <li>✓ Sponsor dashboard</li>
        </ul>

        <Link
          href="/signup"
          className="mt-auto bg-white text-black py-3 rounded-xl text-center font-medium"
        >
          Start Pro
        </Link>
      </div>


      {/* UNLIMITED */}
      <div className="border border-yellow-400 rounded-2xl p-8 flex flex-col h-full shadow-xl">
        <h3 className="text-xl font-semibold text-yellow-400">
          Unlimited
        </h3>

        <p className="mt-4 text-4xl font-bold text-yellow-400">€49</p>
        <p className="text-sm opacity-60">per maand</p>

        <ul className="mt-6 space-y-3 text-sm opacity-80">
          <li>✓ Ongelimiteerd highlight advertenties</li>
          <li>✓ Maandelijkse mailrapportage</li>
          <li>✓ Sponsor dashboard</li>
        </ul>

        <Link
          href="/signup"
          className="mt-auto bg-yellow-400 text-black py-3 rounded-xl text-center font-medium"
        >
          Start Unlimited
        </Link>
      </div>

    </div>

  </div>
</section>

      {/* ACTIVATIE PAKKETTEN */}
<section className="py-24 bg-[#0f2233]">
  <div className="max-w-7xl mx-auto px-6 text-center">

    <h2 className="text-3xl font-bold text-white">
      Activatie Pakketten
    </h2>

    <p className="mt-6 text-white/70 max-w-2xl mx-auto">
      Voor verenigingen die méér uit hun sponsoren willen halen.
      Wij verzorgen de content, activatie en recruitmentversterking.
    </p>

    <div className="mt-16 grid md:grid-cols-4 gap-8 text-left">

      {/* ACTIVATE */}
      <div className="bg-white rounded-2xl p-8 flex flex-col h-full shadow-xl">
        <h3 className="text-green-600 font-semibold text-lg">
          ACTIVATE
        </h3>

        <p className="mt-4 text-4xl font-bold text-black">€300</p>
        <p className="text-sm text-gray-500">per maand</p>

        <ul className="mt-6 space-y-3 text-sm text-gray-700">
          <li>✓ 1 post per week</li>
          <li>✓ LinkedIn, Instagram & Facebook</li>
          <li>✓ Vacature in the spotlight</li>
          <li>✓ Standaard template visuals</li>
          <li>✓ Korte maandupdate</li>
        </ul>

        <p className="mt-6 text-xs text-gray-500">
          Voor zichtbaarheid op social media.
        </p>

        <Link
          href="/signup"
          className="mt-auto bg-green-600 text-white py-3 rounded-xl text-center font-medium hover:bg-green-700 transition"
        >
          Start Activate
        </Link>
      </div>


      {/* GROWTH */}
      <div className="bg-white rounded-2xl p-8 flex flex-col h-full border-2 border-yellow-400 shadow-xl relative">

        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full">
          Meest gekozen
        </div>

        <h3 className="text-yellow-500 font-semibold text-lg">
          GROWTH
        </h3>

        <p className="mt-4 text-4xl font-bold text-black">€750</p>
        <p className="text-sm text-gray-500">per maand</p>

        <ul className="mt-6 space-y-3 text-sm text-gray-700">
          <li>✓ 2 posts per week</li>
          <li>✓ LinkedIn, Instagram & Facebook</li>
          <li>✓ 1 maandelijkse meeting</li>
          <li>✓ Vacature-campagne op maat</li>
          <li>✓ Vacature in the spotlight</li>
        </ul>

        <p className="mt-6 text-xs text-gray-500">
          Voor clubs die recruitment serieus nemen.
        </p>

        <Link
          href="/signup"
          className="mt-auto bg-yellow-400 text-black py-3 rounded-xl text-center font-medium hover:opacity-90 transition"
        >
          Start Growth
        </Link>
      </div>


      {/* PREMIUM */}
      <div className="bg-white rounded-2xl p-8 flex flex-col h-full shadow-xl">
        <h3 className="text-blue-600 font-semibold text-lg">
          PREMIUM
        </h3>

        <p className="mt-4 text-4xl font-bold text-black">€1.350</p>
        <p className="text-sm text-gray-500">per maand</p>

        <ul className="mt-6 space-y-3 text-sm text-gray-700">
          <li>✓ Alles van Growth</li>
          <li>✓ 2 video’s per maand (op locatie)</li>
          <li>✓ Uitgelichte advertentiecampagne</li>
          <li>✓ Maandelijkse strategische sessie</li>
        </ul>

        <p className="mt-6 text-xs text-gray-500">
          Dit is waar je écht impact maakt.
        </p>

        <Link
          href="/signup"
          className="mt-auto bg-blue-600 text-white py-3 rounded-xl text-center font-medium hover:bg-blue-700 transition"
        >
          Start Premium
        </Link>
      </div>


      {/* ELITE */}
      <div className="bg-white rounded-2xl p-8 flex flex-col h-full shadow-xl">
        <h3 className="text-purple-600 font-semibold text-lg">
          ELITE
        </h3>

        <p className="mt-4 text-4xl font-bold text-black">€1.750</p>
        <p className="text-sm text-gray-500">per maand</p>

        <ul className="mt-6 space-y-3 text-sm text-gray-700">
          <li>✓ Alles van Premium</li>
          <li>✓ Maandelijks nieuwe foto’s & video’s</li>
          <li>✓ Dedicated social media manager</li>
          <li>✓ Rapportage op maat</li>
          <li>✓ Extra campagne rondom events</li>
        </ul>

        <p className="mt-6 text-xs text-gray-500">
          High-end sponsoractivatie.
        </p>

        <Link
          href="/signup"
          className="mt-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl text-center font-medium hover:opacity-90 transition"
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
