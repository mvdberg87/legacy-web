import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 text-sm text-center text-gray-500 bg-white">
      <div className="flex justify-center gap-6 mb-3 flex-wrap">

        <Link
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900"
        >
          Privacy
        </Link>

        <Link
          href="/cookies"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900"
        >
          Cookies
        </Link>

        <Link
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900"
        >
          Platformvoorwaarden
        </Link>

        <Link
          href="/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900"
        >
          Contact
        </Link>

      </div>

      <div>
        © {new Date().getFullYear()} Sponsorjobs
      </div>
    </footer>
  );
}