import Link from "next/link";

export default function VoorwaardenPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#0d1b2a]">
      <div className="max-w-3xl mx-auto">

        <Link
  href="/"
  className="inline-flex items-center text-sm text-gray-500 hover:text-[#0d1b2a] transition mb-8"
>
  ← Terug naar Sponsorjobs
</Link>

        {/* Intro */}
        <p className="text-sm text-gray-600 mb-6 text-center">
          Door gebruik te maken van Sponsorjobs ga je akkoord met deze samenwerkingsovereenkomst.
        </p>

        <h1 className="text-3xl font-semibold mb-2 text-center">
          Samenwerkingsovereenkomst Sponsorjobs
        </h1>

        <p className="text-sm text-gray-500 mb-10 text-center">
          Laatst bijgewerkt: 18 juli 2026
        </p>

        {/* Content */}
        <div className="space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="font-semibold text-lg mb-2">1. Definities</h2>
            <p><strong>Sponsorjobs:</strong> het platform van Sponsuls waarmee sportverenigingen vacatures van sponsoren kunnen presenteren.</p>
            <p><strong>Vereniging:</strong> de organisatie die gebruikmaakt van Sponsorjobs.</p>
            <p><strong>Sponsor:</strong> een bedrijf dat via de vereniging vacatures publiceert.</p>
            <p><strong>Platform:</strong> de digitale omgeving (website en tools) van Sponsorjobs.</p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">2. Doel van de samenwerking</h2>
            <p>
              Sponsorjobs biedt verenigingen de mogelijkheid om vacatures van sponsoren zichtbaar te maken via een eigen clubpagina,
              extra waarde te creëren binnen hun sponsorpropositie en nieuwe (terugkerende) inkomstenstromen te genereren.
            </p>
            <p>
              De vereniging gebruikt het platform actief om sponsors te verbinden aan werkgelegenheid.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">3. Gebruik van het platform</h2>
            <p>De vereniging krijgt toegang tot:</p>
            <ul className="list-disc pl-5">
              <li>een eigen clubomgeving;</li>
              <li>een publieke vacaturepagina;</li>
              <li>tools voor het beheren van vacatures en advertenties;</li>
              <li>inzichten zoals pageviews, clicks en engagement.</li>
            </ul>

            <p className="mt-3">De vereniging is verantwoordelijk voor:</p>
            <ul className="list-disc pl-5">
              <li>het correct invoeren van vacatures en sponsorinformatie;</li>
              <li>het delen en promoten van de vacaturepagina;</li>
              <li>het naleven van toepasselijke wet- en regelgeving.</li>
            </ul>
          </section>

          <section>
  <h2 className="font-semibold text-lg mb-2">
    Talentpool
  </h2>

  <p>
    Sponsorjobs biedt verenigingen de mogelijkheid om een Talentpool aan te
    bieden waarin leden zich vrijwillig kunnen aanmelden voor stages,
    bijbanen, startersfuncties en andere carrièremogelijkheden bij
    aangesloten sponsoren.
  </p>

  <ul className="list-disc pl-5 mt-4 space-y-2">
    <li>Deelname aan de Talentpool is vrijwillig.</li>
    <li>Aanmelden is kosteloos.</li>
    <li>Profielen zijn niet openbaar zichtbaar.</li>
    <li>
      Alleen geautoriseerde beheerders van de betreffende vereniging kunnen
      de Talentpool bekijken.
    </li>
    <li>
      Een aanmelding geeft geen garantie op een baan, stage of
      sollicitatiegesprek.
    </li>
    <li>
      Werkgevers bepalen zelfstandig of zij contact opnemen met een
      kandidaat.
    </li>
    <li>
      Gebruikers kunnen op ieder moment verzoeken hun profiel te laten
      verwijderen.
    </li>
  </ul>
</section>

          <section>
            <h2 className="font-semibold text-lg mb-2">4. Verantwoordelijkheden</h2>

            <h3 className="font-medium mt-2">4.1 Vereniging</h3>
            <ul className="list-disc pl-5">
              <li>alle geplaatste vacatures zijn rechtmatig en correct;</li>
              <li>er wordt geen misleidende of ongepaste content geplaatst;</li>
              <li>sponsors hebben toestemming gegeven voor publicatie.</li>
            </ul>

            <h3 className="font-medium mt-4">4.2 Sponsorjobs</h3>
            <ul className="list-disc pl-5">
              <li>faciliteert het platform en de technische werking;</li>
              <li>streeft naar optimale beschikbaarheid, maar garandeert geen ononderbroken werking;</li>
              <li>kan functionaliteiten wijzigen of verbeteren.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">5. Abonnement en betaling</h2>
            <p>
              Het gebruik van Sponsorjobs verloopt via een abonnement (Basic, Plus, Pro of Unlimited).
              Betaling vindt plaats via Stripe.
            </p>

            <h3 className="font-medium mt-3">5.1 Trial / Basic</h3>
            <p>
              Verenigingen kunnen starten met een (tijdelijk) gratis of Basic pakket.
              Na afloop kan toegang beperkt worden indien geen upgrade plaatsvindt.
            </p>

            <h3 className="font-medium mt-3">5.2 Betalingsverplichtingen</h3>
            <p>
              Bij mislukte betaling kan de toegang tijdelijk worden beperkt.
              Bij uitblijven van betaling kan het account worden geblokkeerd.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">6. Duur en beëindiging</h2>
            <p>
              De overeenkomst loopt zolang de vereniging gebruikmaakt van het platform.
              Opzegging kan via het platform of schriftelijk.
            </p>
            <p>
              Sponsorjobs behoudt het recht om accounts te beëindigen bij misbruik,
              overtreding van voorwaarden of niet-betaling.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">7. Data en inzichten</h2>
            <p>Sponsorjobs verzamelt data zoals:</p>
            <ul className="list-disc pl-5">
              <li>pageviews;</li>
              <li>clicks;</li>
              <li>interacties (zoals shares).</li>
            </ul>
            <p className="mt-2">
              Deze data wordt gebruikt voor rapportages en verbetering van het platform.
              De vereniging heeft geen recht op individuele persoonsgegevens van bezoekers.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">8. Aansprakelijkheid</h2>
            <p>
              Sponsorjobs is niet aansprakelijk voor indirecte schade, zoals gemiste inkomsten.
              De aansprakelijkheid is beperkt tot het bedrag dat de vereniging heeft betaald
              in de afgelopen 3 maanden.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">9. Intellectueel eigendom</h2>
            <p>
              Het platform en alle technologie blijven eigendom van Sponsorjobs.
              De vereniging behoudt eigendom van eigen content.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">10. Wijzigingen</h2>
            <p>
              Sponsorjobs kan deze overeenkomst wijzigen.
              Voortgezet gebruik vereist akkoord met de nieuwe versie.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">11. Toepasselijk recht</h2>
            <p>Op deze overeenkomst is Nederlands recht van toepassing.</p>
          </section>

          <section>
  <h2 className="font-semibold text-lg mb-2">
    Contact
  </h2>

  <p>Heb je vragen over deze voorwaarden of over het gebruik van Sponsorjobs? Neem gerust contact met ons op.</p>

  <p className="mt-2">
    📧{" "}
    <a
      href="mailto:info@sponsorjobs.nl"
      className="underline"
    >
      info@sponsorjobs.nl
    </a>
  </p>

  <p>
    🌐{" "}
    <a
      href="https://www.sponsorjobs.nl"
      className="underline"
    >
      www.sponsorjobs.nl
    </a>
  </p>

  <p className="mt-6 text-sm text-gray-500">
    Laatst bijgewerkt: 18 juli 2026
  </p>
</section>

        </div>
      </div>
    </main>
  );
}