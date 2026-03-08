export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 text-sm text-center text-gray-500">
      <div className="flex justify-center gap-6 mb-3 flex-wrap">
        <a href="/privacy" className="hover:text-gray-900">
          Privacy
        </a>

        <a href="/cookies" className="hover:text-gray-900">
          Cookies
        </a>

        <a href="/terms" className="hover:text-gray-900">
          Platformvoorwaarden
        </a>

        <a href="mailto:info@sponsorjobs.nl" className="hover:text-gray-900">
          Contact
        </a>
      </div>

      <div>© {new Date().getFullYear()} Sponsorjobs</div>
    </footer>
  );
}