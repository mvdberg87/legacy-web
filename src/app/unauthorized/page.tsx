export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-bold mb-3">🚫 Geen toegang</h1>
      <p className="text-gray-600 max-w-md">
        Je hebt geen rechten om deze pagina te bekijken.  
        Alleen het Sponsorjobs-beheeraccount heeft toegang tot dit dashboard.
      </p>
    </main>
  );
}
