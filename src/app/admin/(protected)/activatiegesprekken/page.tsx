import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminActivationRequestsPage() {
  const { data: requests, error } = await supabaseAdmin
    .from("activation_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
  <div className="p-8 text-[#0d1b2a]">
        <h1 className="text-2xl font-bold">Activatiegesprekken</h1>

        <p className="mt-6 text-red-500">
          Er is een fout opgetreden bij het ophalen van de aanvragen.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Activatiegesprekken
          </h1>

          <p className="mt-2 text-white/70">
            Overzicht van alle aanvragen voor een vrijblijvend
            activatiegesprek.
          </p>
        </div>

        <div className="text-sm text-white/70">
          {requests?.length ?? 0} aanvragen
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white text-[#0d1b2a]">

        <table className="w-full">

          <thead className="bg-[#0d1b2a] text-white">

            <tr>

              <th className="text-left px-5 py-3">Status</th>

              <th className="text-left px-5 py-3">Bedrijf</th>

              <th className="text-left px-5 py-3">Contactpersoon</th>

              <th className="text-left px-5 py-3">E-mail</th>

              <th className="text-left px-5 py-3">Datum</th>

              <th className="text-right px-5 py-3"></th>

            </tr>

          </thead>

          <tbody>

            {requests?.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  Er zijn nog geen aanvragen binnengekomen.
                </td>
              </tr>
            ) : (
              requests?.map((request) => (
                <tr
  key={request.id}
  className="border-t text-[#0d1b2a] hover:bg-gray-50"
>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      {request.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-medium text-[#0d1b2a]">
                    {request.company_name}
                  </td>

                  <td className="px-5 py-4">
                    {request.contact_name}
                  </td>

                  <td className="px-5 py-4">
                    {request.email}
                  </td>

                  <td className="px-5 py-4">
                    {new Date(request.created_at).toLocaleDateString("nl-NL")}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/activatiegesprekken/${request.id}`}
                      className="text-[#1f9d55] hover:underline font-medium"
                    >
                      Bekijken →
                    </Link>
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}