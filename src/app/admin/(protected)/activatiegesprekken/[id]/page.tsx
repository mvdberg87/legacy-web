import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Props = {
  params: {
    id: string;
  };
};

export default async function ActivationRequestDetailPage({
  params,
}: Props) {
  const { data: request, error } = await supabaseAdmin
    .from("activation_requests")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !request) {
    notFound();
  }

  return (
    <div className="p-8 space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <Link
            href="/admin/activatiegesprekken"
            className="text-sm text-gray-500 hover:underline"
          >
            ← Terug naar overzicht
          </Link>

          <h1 className="mt-3 text-3xl font-bold">
            {request.company_name}
          </h1>

          <p className="text-gray-500">
            Activatiegesprek aanvraag
          </p>

        </div>

        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
          {request.status}
        </span>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 rounded-xl border bg-white p-6">

          <h2 className="text-xl font-semibold mb-6">
            Bedrijfsinformatie
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-gray-500">Bedrijf</p>
              <p className="font-medium">{request.company_name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Contactpersoon</p>
              <p className="font-medium">{request.contact_name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">E-mail</p>
              <p>{request.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Telefoon</p>
              <p>{request.phone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Website</p>
              <p>{request.website || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Sponsor van</p>
              <p>{request.current_sponsor || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Vacatures</p>
              <p>{request.vacancies || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Interesse</p>
              <p>{request.interest || "-"}</p>
            </div>

          </div>

          <div className="mt-8">

            <p className="text-sm text-gray-500 mb-2">
              Toelichting
            </p>

            <div className="rounded-lg border bg-gray-50 p-4 whitespace-pre-wrap">
              {request.notes || "Geen toelichting opgegeven."}
            </div>

          </div>

        </div>

        <div className="space-y-6">

          <div className="rounded-xl border bg-white p-6">

            <h2 className="font-semibold mb-4">
              Status
            </h2>

            <div className="space-y-3">

              <div className="rounded-lg bg-green-100 px-4 py-2">
                {request.status}
              </div>

              <p className="text-sm text-gray-500">
                Status wijzigen voegen we in de volgende stap toe.
              </p>

            </div>

          </div>

          <div className="rounded-xl border bg-white p-6">

            <h2 className="font-semibold mb-4">
              Aangevraagd op
            </h2>

            <p>
              {new Date(request.created_at).toLocaleString("nl-NL")}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}