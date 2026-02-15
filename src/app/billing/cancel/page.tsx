// src/app/billing/cancel/page.tsx

export default function BillingCancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f8fa] p-6">
      <div className="max-w-md bg-white border rounded-xl p-6 text-center">
        <h1 className="text-xl font-semibold mb-4">
          Betaling afgebroken
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          De betaling is niet afgerond.
          Je kunt het op elk moment opnieuw proberen.
        </p>

        <a
          href="/club/billing"
          className="inline-block bg-black text-white px-5 py-2 rounded-lg text-sm font-medium"
        >
          Opnieuw proberen
        </a>
      </div>
    </main>
  );
}
