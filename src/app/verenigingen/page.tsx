import Link from "next/link";

export default function VerenigingenPage() {
  return (
    <main className="min-h-screen bg-[#0d1b2a] text-white">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Meer waarde uit sponsoring.
        </h1>

        <p className="mt-6 max-w-2xl mx-auto opacity-80">
          Sponsorjobs helpt verenigingen om recruitment toe te voegen
          aan hun sponsorpropositie. Vacatures worden onderdeel van
          het sponsorpakket en kunnen als advertentie worden verkocht.
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


      {/* VERDIENMODEL */}
      <section className="bg-white text-black py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold">
            Hoe verdient een club met Sponsorjobs?
          </h2>

          <p className="mt-6 opacity-70">
            Clubs bepalen zelf de prijs van vacatureplaatsingen
            en advertentie-upgrades. Sponsorjobs faciliteert het platform —
            de club beheert de commerciële afspraken.
          </p>

          <div className="mt-16 grid md:grid-cols-3 gap-10 text-left">

            <div className="bg-slate-50 p-8 rounded-2xl">
              <h3 className="font-semibold text-lg">
                Vacature als sponsoractivatie
              </h3>
              <p className="mt-3 text-sm opacity-70">
                Neem vacatureplaatsing op in het sponsorpakket
                of verkoop deze als losse activatie.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl">
              <h3 className="font-semibold text-lg">
                Highlight als advertentie
              </h3>
              <p className="mt-3 text-sm opacity-70">
                Bied sponsors een premium plaatsing bovenaan
                de vacaturepagina als betaalde upgrade.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl">
              <h3 className="font-semibold text-lg">
                Extra social activatie
              </h3>
              <p className="mt-3 text-sm opacity-70">
                Versterk vacatures via LinkedIn en Instagram
                als aanvullende inkomstenstroom.
              </p>
            </div>

          </div>

          <p className="mt-12 font-medium">
            Eén extra sponsoractivatie kan al voldoende zijn
            om de investering in Sponsorjobs te dekken.
          </p>

        </div>
      </section>


      {/* BEGELEIDINGSPAKKETTEN */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold">
            Begeleidingspakketten
          </h2>

          <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">

            {/* CORE */}
            <div className="border border-white/20 rounded-2xl p-8">
              <h3 className="text-xl font-semibold">Core</h3>
              <p className="mt-4 text-4xl font-bold">€750</p>
              <p className="text-sm opacity-60">per seizoen</p>

              <ul className="mt-6 space-y-3 text-sm opacity-80">
                <li>✓ Platform inrichting</li>
                <li>✓ 1 actieve vacature</li>
                <li>✓ Sponsor pitchtemplate</li>
                <li>✓ Bestuur / commissie training</li>
                <li>✓ Jaarlijkse evaluatie</li>
              </ul>

              <Link
                href="/signup"
                className="block mt-8 bg-white text-black py-3 rounded-xl text-center font-medium"
              >
                Start Core
              </Link>
            </div>


            {/* GROWTH (Highlight) */}
            <div className="border-2 border-[#1f9d55] bg-[#0f2233] rounded-2xl p-8 relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1f9d55] text-white text-xs px-3 py-1 rounded-full">
                Meest gekozen
              </div>

              <h3 className="text-xl font-semibold text-[#1f9d55]">Growth</h3>
              <p className="mt-4 text-4xl font-bold text-[#1f9d55]">€1.350</p>
              <p className="text-sm opacity-60">per seizoen</p>

              <ul className="mt-6 space-y-3 text-sm opacity-80">
                <li>✓ Alles uit Core</li>
                <li>✓ 3 vacatures per seizoen</li>
                <li>✓ Sponsorpropositie optimalisatie</li>
                <li>✓ LinkedIn activatieplan</li>
                <li>✓ Highlight advertentiemodel</li>
              </ul>

              <Link
                href="/signup"
                className="block mt-8 bg-[#1f9d55] text-white py-3 rounded-xl text-center font-medium"
              >
                Start Growth
              </Link>
            </div>


            {/* PREMIUM */}
            <div className="border border-white/20 rounded-2xl p-8">
              <h3 className="text-xl font-semibold">Premium</h3>
              <p className="mt-4 text-4xl font-bold">€1.950</p>
              <p className="text-sm opacity-60">per seizoen</p>

              <ul className="mt-6 space-y-3 text-sm opacity-80">
                <li>✓ Alles uit Growth</li>
                <li>✓ Onbeperkt vacatures</li>
                <li>✓ LinkedIn + Instagram activatie</li>
                <li>✓ Maandelijkse optimalisatiecall</li>
                <li>✓ Strategische sponsorintegratie</li>
              </ul>

              <Link
                href="/signup"
                className="block mt-8 bg-white text-black py-3 rounded-xl text-center font-medium"
              >
                Start Premium
              </Link>
            </div>

          </div>

          <div className="mt-16">
            <Link
              href="/abonnementen"
              className="text-sm underline opacity-80"
            >
              Bekijk platform abonnementen →
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}
