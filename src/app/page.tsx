// src/app/page.tsx

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0d1b2a] text-white">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-32 md:pt-40 pb-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
  Maak van sponsoring een recruitmentkanaal.
  <br />
  <span className="text-[#1f9d55]">
    Extra waarde voor sponsors.
  </span>
</h1>

<p>
Help sponsors aan personeel en geef je vereniging een onderscheidende sponsorpropositie.

Sponsorjobs helpt sportverenigingen om vacatures van sponsoren zichtbaar te maken binnen hun eigen netwerk. Zo creëer je extra sponsorwaarde, versterk je sponsorrelaties en genereer je nieuwe commerciële kansen.
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
  className="border border-white px-6 py-3 rounded-xl font-semibold 
           hover:bg-white hover:text-[#0d1b2a] transition duration-200"
>
  Start gratis met je club
</Link>
        </div>
      </section>


      {/* PROBLEEM → OPLOSSING */}
      <section className="bg-white text-black py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          <div>
            <h2 className="text-2xl font-bold">
              Sponsors hebben personeel nodig.
            </h2>
            <p className="mt-4 opacity-70">
              Arbeidsmarktkrapte raakt vrijwel iedere branche. Veel sponsoren zijn continu op zoek naar nieuwe medewerkers, maar traditionele vacatures leveren steeds minder resultaat op.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0d1b2a]">
              Verenigingen hebben een uniek netwerk.
            </h2>
            <p className="mt-4 opacity-70">
              Leden, ouders, vrijwilligers, supporters en zakelijke relaties vormen samen een krachtig lokaal netwerk. Sponsorjobs maakt dit netwerk toegankelijk voor sponsoren en verandert sponsoring in een concrete business-oplossing.
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
          Vacaturepagina gekoppeld aan de clubwebsite
        </h3>
        <p className="mt-2 opacity-80 text-sm">
          Iedere club heeft een eigen vacaturepagina
          binnen Sponsorjobs, gekoppeld aan de club.
        </p>
      </div>

      <div>
        <div className="text-4xl font-bold text-[#1f9d55]">03</div>
        <h3 className="mt-4 font-semibold text-lg">
          Club activeert het netwerk
        </h3>
        <p className="mt-2 opacity-80 text-sm">
          Website, social media, nieuwsbrief en narrowcasting
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
      Van reclamebord naar business-oplossing
    </h2>

    <p className="mt-6 max-w-3xl mx-auto opacity-70">
      Sponsorjobs maakt het mogelijk om recruitment toe te voegen
      aan het sponsorpakket. Clubs kunnen vacatures aanbieden
      als onderdeel van een sponsorovereenkomst of als losse activatie.
    </p>

    <div className="mt-16 grid md:grid-cols-3 gap-10 text-left">

      <div className="bg-slate-50 p-8 rounded-2xl">
        <h3 className="font-semibold text-lg">
          Recruitmentactivatie
        </h3>
        <p className="mt-3 text-sm opacity-70">
          Vacatures als onderdeel van een sponsorpakket
        </p>
      </div>

      <div className="bg-slate-50 p-8 rounded-2xl">
        <h3 className="font-semibold text-lg">
          Employer branding
        </h3>
        <p className="mt-3 text-sm opacity-70">
          Laat sponsoren zichtbaar zijn als aantrekkelijke werkgever
        </p>
      </div>

      <div className="bg-slate-50 p-8 rounded-2xl">
        <h3 className="font-semibold text-lg">
          Extra activaties
        </h3>
        <p className="mt-3 text-sm opacity-70">
          Social media, narrowcasting en uitgelichte vacatures
        </p>
      </div>

    </div>

    <p className="mt-16 max-w-2xl mx-auto font-medium">
      Sponsorjobs helpt verenigingen om sponsoring te verschuiven van zichtbaarheid naar aantoonbare impact.
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
              <li>✓ Bereik lokaal talent</li>
              <li>✓ Versterk werkgeversmerk</li>
              <li>✓ Recruitment via vertrouwde communities</li>
              <li>✓ Meer rendement uit sponsoring</li>
              <li>✓ Meetbare resultaten</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="text-xl font-bold">
              Voor sportverenigingen
            </h3>
            <ul className="mt-6 space-y-3 text-sm opacity-80">
              <li>✓ Meer sponsorwaarde</li>
              <li>✓ Hogere sponsorretentie</li>
              <li>✓ Nieuwe inkomstenstromen</li>
              <li>✓ Professionelere sponsorpropositie</li>
              <li>✓ Geen technische kennis nodig</li>
            </ul>
          </div>

        </div>
      </section>


      {/* CTA */}
<section className="py-24 text-center">
  <h2 className="text-3xl font-bold">
    Geef sponsoren een reden om langer partner te blijven.
  </h2>

  <p className="mt-4 max-w-2xl mx-auto opacity-80">
    Ontdek hoe jouw vereniging recruitment kan inzetten als sponsoractivatie
    en extra waarde kan creëren voor sponsoren.
  </p>

  <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">

    <Link
      href="/signup"
      className="bg-[#1f9d55] px-8 py-4 rounded-2xl font-semibold hover:bg-[#15803d] transition"
    >
      Start gratis met je club
    </Link>

    <Link
      href="/contact"
      className="border border-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-[#0d1b2a] transition"
    >
      Plan een demo
    </Link>

  </div>
</section>

    </main>
  );
}
