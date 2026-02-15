// src/app/page.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0d1b2a] text-white">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Recruitment via sportclubs.
          <br />
          <span className="text-[#1f9d55]">
            Meer dan zichtbaarheid.
          </span>
        </h1>

        <p className="mt-6 text-lg opacity-80 max-w-2xl mx-auto">
          Sponsorjobs verbindt bedrijven met talent binnen sportverenigingen.
          Sponsors krijgen directe toegang tot leden.
          Clubs creëren extra waarde voor hun netwerk.
        </p>

        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="bg-[#1f9d55] px-6 py-3 rounded-xl font-semibold hover:bg-[#15803d] transition"
          >
            Club login
          </Link>

          <Link
            href="/signup"
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

          <div className="mt-16 grid md:grid-cols-3 gap-10">

            <div>
              <div className="text-4xl font-bold text-[#1f9d55]">01</div>
              <h3 className="mt-4 font-semibold text-lg">
                Sponsor plaatst vacature
              </h3>
              <p className="mt-2 opacity-80 text-sm">
                Vacatures worden gekoppeld aan een club en
                zichtbaar binnen het netwerk.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-[#1f9d55]">02</div>
              <h3 className="mt-4 font-semibold text-lg">
                Leden ontdekken kansen
              </h3>
              <p className="mt-2 opacity-80 text-sm">
                Werk binnen je eigen community.
                Vertrouwd en lokaal.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-[#1f9d55]">03</div>
              <h3 className="mt-4 font-semibold text-lg">
                Sponsoring krijgt echte waarde
              </h3>
              <p className="mt-2 opacity-80 text-sm">
                Recruitment wordt onderdeel van het sponsorcontract.
              </p>
            </div>

          </div>
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
