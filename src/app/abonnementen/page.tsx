import Link from "next/link";

export default function AbonnementenPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-black py-24">

      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* HEADER */}
        <h1 className="text-4xl md:text-5xl font-bold">
          Platform abonnementen
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-gray-600">
          Kies het abonnement dat past bij de ambitie van jouw vereniging.
          Alle abonnementen zijn maandelijks opzegbaar.
        </p>


        {/* PRICING CARDS */}
        <div className="mt-20 grid md:grid-cols-4 gap-8 text-left">

          {/* BASIC */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold">Basic</h3>

            <p className="mt-4 text-4xl font-bold">
              €29
            </p>
            <p className="text-sm text-gray-500">per maand</p>

            <ul className="mt-8 space-y-3 text-sm text-gray-600">
              <li>✓ 1 actieve vacature</li>
              <li>✓ Club vacaturepagina</li>
              <li>✓ Basis analytics</li>
              <li>✓ Email support</li>
            </ul>

            <Link
              href="/signup"
              className="block mt-10 bg-black text-white text-center py-3 rounded-xl font-medium hover:opacity-90 transition"
            >
              Start Basic
            </Link>
          </div>


          {/* PLUS */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold">Plus</h3>

            <p className="mt-4 text-4xl font-bold">
              €59
            </p>
            <p className="text-sm text-gray-500">per maand</p>

            <ul className="mt-8 space-y-3 text-sm text-gray-600">
              <li>✓ 3 actieve vacatures</li>
              <li>✓ Highlight mogelijkheid</li>
              <li>✓ Uitgebreide analytics</li>
              <li>✓ Prioriteit support</li>
            </ul>

            <Link
              href="/signup"
              className="block mt-10 bg-black text-white text-center py-3 rounded-xl font-medium hover:opacity-90 transition"
            >
              Start Plus
            </Link>
          </div>


          {/* PRO (Highlighted) */}
          <div className="relative bg-white p-8 rounded-3xl border-2 border-[#1f9d55] shadow-xl scale-105">

            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1f9d55] text-white text-xs px-4 py-1 rounded-full">
              Meest gekozen
            </div>

            <h3 className="text-lg font-semibold text-[#1f9d55]">Pro</h3>

            <p className="mt-4 text-4xl font-bold text-[#1f9d55]">
              €99
            </p>
            <p className="text-sm text-gray-500">per maand</p>

            <ul className="mt-8 space-y-3 text-sm text-gray-700">
              <li>✓ Onbeperkt vacatures</li>
              <li>✓ Highlight advertenties</li>
              <li>✓ Social activatie koppeling</li>
              <li>✓ Volledige analytics</li>
              <li>✓ Commerciële tools</li>
            </ul>

            <Link
              href="/signup"
              className="block mt-10 bg-[#1f9d55] text-white text-center py-3 rounded-xl font-medium hover:bg-[#15803d] transition"
            >
              Start Pro
            </Link>
          </div>


          {/* UNLIMITED */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold">Unlimited</h3>

            <p className="mt-4 text-4xl font-bold">
              Op aanvraag
            </p>
            <p className="text-sm text-gray-500">
              Voor grotere verenigingen
            </p>

            <ul className="mt-8 space-y-3 text-sm text-gray-600">
              <li>✓ Multi-team structuur</li>
              <li>✓ White-label opties</li>
              <li>✓ API koppelingen</li>
              <li>✓ Dedicated support</li>
            </ul>

            <Link
              href="/signup"
              className="block mt-10 border border-black text-center py-3 rounded-xl font-medium hover:bg-black hover:text-white transition"
            >
              Neem contact op
            </Link>
          </div>

        </div>


        {/* FOOTNOTE */}
        <p className="mt-16 text-sm text-gray-500">
          Alle prijzen zijn exclusief btw. Abonnementen zijn maandelijks opzegbaar.
        </p>

      </div>

    </main>
  );
}
