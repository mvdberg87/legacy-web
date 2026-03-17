import Link from "next/link";

export default function ActivatiePage() {
  return (
    <main className="min-h-screen bg-[#0d1b2a] text-white">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-24 text-center">

        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Sponsoractivatie die recruitment oplevert.
        </h1>

        <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
          Vacatures van sponsoren zichtbaar maken is stap één.
          Maar echte impact ontstaat wanneer je deze vacatures
          actief promoot binnen het clubnetwerk.
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
                <li>✓ Club plaatst zelf de vacatures op platform</li>
                <li>✓ Club maakt zelf de visuals voor Social Media</li>
                <li>✓ 1 post per maand op LinkedIn, Instagram & Facebook</li>
                <li>✓ Vacature in the spotlight</li>
                <li>✓ Korte maandupdate</li>
              </ul>

              <p className="mt-6 text-xs text-gray-500">
                Voor zichtbaarheid op social media.
              </p>

              <div className="mt-auto pt-12">
                <Link
                  href="/contact?pakket=activate"
                  className="block bg-green-600 text-white py-3 rounded-xl text-center font-medium hover:bg-green-700 transition"
                >
                  Start Activate
                </Link>
              </div>

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
                <li>✓ Wij plaatsen alle vacatures op het platform</li>
                <li>✓ Wij leveren standaard templates voor LinkedIn, Instagram & Facebook</li>
                <li>✓ 2 posts per maand op LinkedIn, Instagram & Facebook</li>
                <li>✓ Vacature in the spotlight</li>
                <li>✓ 2 evaluatie meetings per Seizoen</li>
              </ul>

              <p className="mt-6 text-xs text-gray-500">
                Voor clubs die recruitment serieus nemen.
              </p>

              <div className="mt-auto pt-12">
                <Link
                  href="/contact?pakket=growth"
                  className="block bg-yellow-400 text-black py-3 rounded-xl text-center font-medium hover:bg-yellow-300 transition"
                >
                  Start Growth
                </Link>
              </div>

            </div>


            {/* PREMIUM */}
            <div className="bg-white rounded-2xl p-8 flex flex-col h-full shadow-xl">

              <h3 className="text-blue-600 font-semibold text-lg">
                PREMIUM
              </h3>

              <p className="mt-4 text-4xl font-bold text-black">€1.350</p>
              <p className="text-sm text-gray-500">per maand</p>

              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                <li>✓ Wij plaatsen alle vacatures op het platform</li>
                <li>✓ Wij leveren standaard templates voor LinkedIn, Instagram & Facebook</li>
                <li>✓ 1 post per week op LinkedIn, Instagram & Facebook</li>
                <li>✓ Vacature in the spotlight</li>
                <li>✓ Vacaturecampagne op maat</li>
                <li>✓ 2 evaluatie meetings per Seizoen</li>
              </ul>

              <p className="mt-6 text-xs text-gray-500">
                Dit is waar je écht impact maakt.
              </p>

              <div className="mt-auto pt-12">
                <Link
                  href="/contact?pakket=premium"
                  className="block bg-blue-600 text-white py-3 rounded-xl text-center font-medium hover:bg-blue-700 transition"
                >
                  Start Premium
                </Link>
              </div>

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
                <li>✓ Maandelijks 1 vacaturevideo op locatie</li>
                <li>✓ Dedicated social media manager</li>
                <li>✓ Rapportage op maat</li>
                <li>✓ Extra offline campagne</li>
                <li>✓ 1 evaluatie meeting per kwartaal</li>
              </ul>

              <p className="mt-6 text-xs text-gray-500">
                High-end sponsoractivatie.
              </p>

              <div className="mt-auto pt-12">
                <Link
                  href="/contact?pakket=elite"
                  className="block bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl text-center font-medium hover:opacity-90 transition"
                >
                  Start Elite
                </Link>
              </div>

            </div>

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

          <Link
            href="/signup"
            className="bg-[#1f9d55] px-8 py-4 rounded-2xl font-semibold hover:bg-[#15803d] transition"
          >
            Start met Sponsorjobs
          </Link>

        </div>

      </section>


    </main>
  );
}