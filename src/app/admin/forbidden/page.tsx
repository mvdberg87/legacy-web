// src/app/admin/forbidden/page.tsx

import Link from "next/link";

export default function AdminForbiddenPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f8fa] px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow p-8 text-center">
        <div className="text-5xl mb-4">⛔️</div>

        <h1 className="text-xl font-semibold mb-2">
          Geen toegang
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          Je bent wel ingelogd, maar jouw account heeft geen rechten
          om deze adminomgeving te bekijken.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex justify-center rounded-lg bg-[#0d1b2a] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Naar homepage
          </Link>

          <Link
            href="/admin/login"
            className="inline-flex justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Inloggen met ander account
          </Link>
        </div>
      </div>
    </main>
  );
}
