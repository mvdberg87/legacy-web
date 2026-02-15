// src/app/billing/success/page.tsx

export default function BillingSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f8fa] p-6">
      <div className="max-w-md bg-white border rounded-xl p-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">
          🎉 Betaling geslaagd
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          Dank je wel! De betaling is succesvol afgerond.
          Jullie abonnement wordt nu geactiveerd.
        </p>

        <p className="text-xs text-gray-500 mb-6">
          Dit kan een paar seconden duren.
          Je wordt automatisch doorgestuurd.
        </p>

        <a
          href="/club"
          className="inline-block bg-black text-white px-5 py-2 rounded-lg text-sm font-medium"
        >
          Ga naar dashboard
        </a>
      </div>
    </main>
  );
}
