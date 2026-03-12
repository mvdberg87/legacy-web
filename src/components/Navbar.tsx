import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0d1b2a]">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo/sponsorjobs-light.png"
            alt="SponsorJobs"
            width={160}
            height={40}
            className="cursor-pointer"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex gap-6 md:gap-12 text-sm md:text-lg font-semibold tracking-wide text-white">

          <Link
            href="/verenigingen"
            className="hover:opacity-80 transition"
          >
            VERENIGINGEN
          </Link>

          <Link href="/activatie" className="hover:opacity-80 transition">
ACTIVATIE
</Link>


          <Link
            href="/login"
            className="hover:opacity-80 transition"
          >
            LOGIN
          </Link>

        </nav>

      </div>
    </header>
  );
}