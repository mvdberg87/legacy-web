// src/app/page.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0d1b2a] text-white">

        <header className="absolute top-0 left-0 w-full py-6">
  <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
    <div className="font-semibold text-lg">Sponsorjobs</div>
    <nav className="space-x-6 text-sm opacity-80">
      <Link href="/verenigingen">Voor verenigingen</Link>
      <Link href="/abonnementen">Abonnementen</Link>
      <Link href="/login" target="_blank">Login</Link>
    </nav>
  </div>
</header>


      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1>
Recruitment via sportclubs.
<br />
<span className="text-[#1f9d55]">
Extra waarde voor sponsors.
</span>
</h1>

<p>
Sponsorjobs helpt sportverenigingen om recruitment onderdeel te maken
van hun sponsorpropositie. Clubs plaatsen vacatures van sponsors,
die zichtbaar worden binnen het clubnetwerk en via de clubkanalen.
</p>


        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
          <Link
  href="/login"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-[#1f9d55] px-6 py-3 rounded-xl font-semibold hover:bg-[#15803d] transition"
>
  Club login
</Link>

          <Link
  href="/signup"
  target="_blank"
  rel="noopener noreferrer"
  className="border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-black transition"
>
  Meld je club aan
</Link>
        </div>
      </section>


      {/* PROBLEEM → OPLOSSING */}
      <section className="bg-white text-black py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          <div>
            <h2 className="text-2xl font-bold">
              Sponsoring levert vaak alleen zichtbaarheid op.
            </h2>
            <p className="mt-4 opacity-70">
              Bedrijven zoeken personeel. Clubs zoeken duurzame sponsoring.
              Toch blijven beide werelden los van elkaar.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0d1b2a]">
              Sponsorjobs verbindt die werelden.
            </h2>
            <p className="mt-4 opacity-70">
              Vacatures van sponsors worden zichtbaar binnen het clubnetwerk.
              Zo wordt sponsoring een recruitmentkanaal.
            </p>
          </div>

        </div>
      </section>


      {/* HOE HET WERKT */}
<section className="py-24">
  <div className="max-w-6xl mx-auto px-6 text-center">

    <h2 className="text-3xl font-bold">
      Hoe werkt Sponsorjobs?
    </h2>

    <div className="mt-16 grid md:grid-cols-4 gap-10">

      <div>
        <div className="text-4xl font-bold text-[#1f9d55]">01</div>
        <h3 className="mt-4 font-semibold text-lg">
          Club plaatst vacature van sponsor
        </h3>
        <p className="mt-2 opacity-80 text-sm">
          De club beheert en publiceert de vacature
          als onderdeel van de sponsoractivatie.
        </p>
      </div>

      <div>
        <div className="text-4xl font-bold text-[#1f9d55]">02</div>
        <h3 className="mt-4 font-semibold text-lg">
          Vacature zichtbaar op clubwebsite
        </h3>
        <p className="mt-2 opacity-80 text-sm">
          Iedere club heeft een eigen vacaturepagina
          binnen Sponsorjobs, gekoppeld aan de club.
        </p>
      </div>

      <div>
        <div className="text-4xl font-bold text-[#1f9d55]">03</div>
        <h3 className="mt-4 font-semibold text-lg">
          Extra activatie via social media
        </h3>
        <p className="mt-2 opacity-80 text-sm">
          Vacatures kunnen versterkt worden via
          LinkedIn en Instagram van de club.
        </p>
      </div>

      <div>
        <div className="text-4xl font-bold text-[#1f9d55]">04</div>
        <h3 className="mt-4 font-semibold text-lg">
          Sponsoring krijgt extra waarde
        </h3>
        <p className="mt-2 opacity-80 text-sm">
          Recruitment wordt een meetbare activatie
          binnen het sponsorcontract.
        </p>
      </div>

    </div>
  </div>
</section>

{/* VERDIENMODEL VOOR CLUBS */}
<section className="bg-white text-black py-24">
  <div className="max-w-6xl mx-auto px-6 text-center">

    <h2 className="text-3xl font-bold">
      Wat levert dit verenigingen op?
    </h2>

    <p className="mt-6 max-w-3xl mx-auto opacity-70">
      Sponsorjobs maakt het mogelijk om recruitment toe te voegen
      aan het sponsorpakket. Clubs kunnen vacatures aanbieden
      als onderdeel van een sponsorovereenkomst of als losse activatie.
    </p>

    <div className="mt-16 grid md:grid-cols-3 gap-10 text-left">

      <div className="bg-slate-50 p-8 rounded-2xl">
        <h3 className="font-semibold text-lg">
          Vacature als sponsoractivatie
        </h3>
        <p className="mt-3 text-sm opacity-70">
          Sponsors krijgen de mogelijkheid om een vacature
          via de club te publiceren op de clubpagina.
        </p>
      </div>

      <div className="bg-slate-50 p-8 rounded-2xl">
        <h3 className="font-semibold text-lg">
          Highlight als advertentie
        </h3>
        <p className="mt-3 text-sm opacity-70">
          Clubs kunnen vacatures extra zichtbaar maken
          door deze uit te lichten als advertentie.
          Dit kan als premium optie binnen het sponsorcontract.
        </p>
      </div>

      <div className="bg-slate-50 p-8 rounded-2xl">
        <h3 className="font-semibold text-lg">
          Extra social activatie
        </h3>
        <p className="mt-3 text-sm opacity-70">
          Vacatures kunnen aanvullend gepromoot worden via
          LinkedIn en Instagram van de club.
          Zo ontstaat een extra inkomstenstroom.
        </p>
      </div>

    </div>

    <p className="mt-16 max-w-2xl mx-auto font-medium">
      Zo wordt sponsoring niet alleen zichtbaar,
      maar ook meetbaar en commercieel aantrekkelijk.
    </p>

  </div>
</section>

      {/* VOOR WIE */}
      <section className="bg-slate-50 text-black py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="text-xl font-bold">
              Voor bedrijven
            </h3>
            <ul className="mt-6 space-y-3 text-sm opacity-80">
              <li>✓ Bereik betrokken doelgroepen</li>
              <li>✓ Recruitment via lokale community</li>
              <li>✓ Meetbare sponsoractivatie</li>
              <li>✓ Versterk werkgeversmerk</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="text-xl font-bold">
              Voor sportclubs
            </h3>
            <ul className="mt-6 space-y-3 text-sm opacity-80">
              <li>✓ Extra sponsorwaarde</li>
              <li>✓ Verhoog retentie van sponsoren</li>
              <li>✓ Nieuwe inkomstenstromen</li>
              <li>✓ Professionalisering van sponsoring</li>
            </ul>
          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="py-24 text-center">
        <h2 className="text-3xl font-bold">
          Maak van sponsoring een recruitmentkanaal.
        </h2>

        <div className="mt-10">
          <Link
  href="/signup"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-[#1f9d55] px-8 py-4 rounded-2xl font-semibold hover:bg-[#15803d] transition"
>
  Start met Sponsorjobs
</Link>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 text-center text-sm opacity-60">
        © {new Date().getFullYear()} Sponsorjobs
      </footer>

    </main>
  );
}
