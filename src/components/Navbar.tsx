import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        <Link href="/">
          <Image
            src="/logo/sponsorjobs-light.png"
            alt="SponsorJobs"
            width={160}
            height={40}
            className="cursor-pointer"
          />
        </Link>

        <nav className="flex gap-8 text-sm text-white/80">
          <Link href="/verenigingen" className="hover:text-white">
            Voor verenigingen
          </Link>

          <Link href="/login" className="hover:text-white">
            Login
          </Link>
        </nav>

      </div>
    </header>
  );
}