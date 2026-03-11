import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center">

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
        <nav className="flex-1 flex justify-center gap-14 text-white text-lg md:text-xl font-semibold tracking-wide">

          <Link
  href="/verenigingen"
  className="text-white hover:opacity-80 transition"
>
            VOOR VERENIGINGEN
          </Link>

          <Link
  href="/login"
  className="text-white hover:opacity-80 transition"
>
            LOGIN
          </Link>

        </nav>

      </div>
    </header>
  );
}