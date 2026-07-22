import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdvertisementLeadsPage() {
  const { data: leads, error } = await supabaseAdmin
    .from("advertisement_leads")
    .select("*")
    .order("created_at", { ascending: false });

    const totalLeads = leads?.length ?? 0;

const pendingLeads =
  leads?.filter(
    (lead) => lead.status === "checkout_pending"
  ).length ?? 0;

const paidLeads =
  leads?.filter(
    (lead) => lead.status === "paid"
  ).length ?? 0;

const cancelledLeads =
  leads?.filter(
    (lead) => lead.status === "cancelled"
  ).length ?? 0;

const conversion =
  totalLeads === 0
    ? 0
    : Math.round((paidLeads / totalLeads) * 100);

    const packagePrices = {
  partner: 350,
  spotlight: 750,
  premium: 1250,
};

const totalPipelineValue =
  leads?.reduce((sum, lead) => {
    if (!Array.isArray(lead.campaigns)) return sum;

    const leadValue = (
  lead.campaigns as {
    packageKey: "partner" | "spotlight" | "premium";
    quantity: number;
  }[]
).reduce((total, campaign) => {
      const price =
        packagePrices[
          campaign.packageKey as keyof typeof packagePrices
        ] ?? 0;

      return total + price * (campaign.quantity ?? 1);
    }, 0);

    return sum + leadValue;
  }, 0) ?? 0;

  if (error) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white">
        Advertisement Leads
      </h1>

      <p className="mt-6 text-red-500">
        Er is een fout opgetreden bij het ophalen van de leads.
      </p>
    </div>
  );
}

  return (
    <div className="p-8">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Advertisement Leads
          </h1>

          <p className="mt-2 text-white/70">
            Overzicht van alle recruitmentcampagnes.
          </p>
        </div>

        <div className="text-sm text-white/70">
          {leads?.length ?? 0} leads
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">

  <div className="rounded-xl bg-white p-5 min-h-[160px] flex flex-col justify-between">
    <div className="text-2xl md:text-3xl text-[#0d1b2a]">
  {totalLeads}
</div>

    <div className="text-sm text-gray-500">
      Leads
    </div>
  </div>

  <div className="rounded-xl bg-white p-5 min-h-[160px] flex flex-col justify-between">
    <div className="text-2xl md:text-3xl text-orange-600">
      {pendingLeads}
    </div>

    <div className="text-sm text-gray-500">
      Checkout
    </div>
  </div>

  <div className="rounded-xl bg-white p-5 min-h-[160px] flex flex-col justify-between">
    <div className="text-2xl md:text-3xl text-green-600">
      {paidLeads}
    </div>

    <div className="text-sm text-gray-500">
      Betaald
    </div>
  </div>

  <div className="rounded-xl bg-white p-5 min-h-[160px] flex flex-col justify-between">
    <div className="text-2xl md:text-3xl text-red-600">
      {cancelledLeads}
    </div>

    <div className="text-sm text-gray-500">
      Geannuleerd
    </div>
  </div>

  <div className="rounded-xl bg-white p-5 min-h-[160px] flex flex-col justify-between">
    <div className="text-2xl md:text-3xl text-blue-600">
      {conversion}%
    </div>

    <div className="text-sm text-gray-500">
      Conversie
    </div>
  </div>

  <div className="rounded-xl bg-white p-5 min-h-[160px] flex flex-col justify-between">
  <div className="text-2xl md:text-3xl text-[#1f9d55]">
    € {totalPipelineValue.toLocaleString("nl-NL")}
  </div>

  <div className="text-sm text-gray-500">
    Pipelinewaarde
  </div>
</div>

      </div>

<div className="overflow-hidden rounded-xl border bg-white text-[#0d1b2a]">

        <table className="w-full">

          <thead className="bg-[#0d1b2a] text-white">
            <tr>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Bedrijf</th>
              <th className="text-left px-5 py-3">Contact</th>
              <th className="text-left px-5 py-3">E-mail</th>
              <th className="text-left px-5 py-3">
  Campagnes
</th>

<th className="text-left px-5 py-3">
  Waarde
</th>

<th className="text-left px-5 py-3">
  Datum
</th>
              <th className="text-right px-5 py-3"></th>
            </tr>
          </thead>

          <tbody>

            {leads?.length === 0 ? (

              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  Er zijn nog geen leads.
                </td>
              </tr>

            ) : (

              leads.map((lead) => {

  const totalValue = Array.isArray(lead.campaigns)
    ? (
  lead.campaigns as {
    packageKey: "partner" | "spotlight" | "premium";
    quantity: number;
  }[]
).reduce((total, campaign) => {
        const price =
          packagePrices[
            campaign.packageKey as keyof typeof packagePrices
          ] ?? 0;

        return total + price * (campaign.quantity ?? 1);
      }, 0)
    : 0;

  return (

                <tr
                  key={lead.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-5 py-4">
  <span
    className={`rounded-full px-3 py-1 text-sm font-medium
      ${
        lead.status === "paid"
          ? "bg-green-100 text-green-700"
          : lead.status === "checkout_pending"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-100 text-gray-700"
      }`}
  >
    {
  lead.status === "checkout_pending"
    ? "Wacht op betaling"
    : lead.status === "paid"
    ? "Betaald"
    : lead.status === "cancelled"
    ? "Geannuleerd"
    : lead.status
}
  </span>
</td>

                  <td className="px-5 py-4 font-medium">
                    {lead.company_name}
                  </td>

                  <td className="px-5 py-4">
                    {lead.contact_name}
                  </td>

                  <td className="px-5 py-4">
                    {lead.company_email}
                  </td>

                  <td className="px-5 py-4">
  {Array.isArray(lead.campaigns)
    ? lead.campaigns.length
    : 0}
</td>

<td className="px-5 py-4 font-semibold">
  € {totalValue.toLocaleString("nl-NL")}
</td>

                  <td className="px-5 py-4">
                    {new Date(
                      lead.created_at
                    ).toLocaleDateString("nl-NL")}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/advertisement-leads/${lead.id}`}
                      className="text-[#1f9d55] hover:underline font-medium"
                    >
                      Bekijken →
                    </Link>
                  </td>

                </tr>

                );
            })

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}