import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 text-sm text-center text-gray-500 bg-white">
      <div className="flex justify-center gap-6 mb-3 flex-wrap">

        <Link href="/privacy" className="hover:text-gray-900">
          Privacy
        </Link>

        <Link href="/cookies" className="hover:text-gray-900">
          Cookies
        </Link>

        <Link href="/terms" className="hover:text-gray-900">
          Platformvoorwaarden
        </Link>

        <Link href="/verenigingen">
        Verenigingen
        </Link>

        <a href="mailto:info@sponsorjobs.nl" className="hover:text-gray-900">
          Contact
        </a>

      </div>

      <div>© {new Date().getFullYear()} SponsorJobs</div>
    </footer>
  );
}