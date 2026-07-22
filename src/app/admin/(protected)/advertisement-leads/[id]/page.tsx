import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles = {
    pending_activation:
      "bg-yellow-100 text-yellow-800",

    active:
      "bg-green-100 text-green-800",

      pending:
  "bg-yellow-100 text-yellow-800",

      paid:
  "bg-green-100 text-green-800",

    expired:
      "bg-red-100 text-red-800",

    cancelled:
      "bg-gray-100 text-gray-700",
  };

  const labels = {
    pending_activation:
      "Wacht op activatie",

    active:
      "Actief",

      paid: "Betaald",

      pending:
  "In behandeling",

    expired:
      "Verlopen",

    cancelled:
      "Geannuleerd",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
        styles[
          status as keyof typeof styles
        ] ??
        "bg-gray-100 text-gray-700"
      }`}
    >
      {labels[
        status as keyof typeof labels
      ] ?? status}
    </span>
  );
}

export default async function AdvertisementLeadDetail({
  params,
}: {
  params: { id: string };
}) {
  const { data: lead } = await supabaseAdmin
    .from("advertisement_leads")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!lead) {
    notFound();
  }

  const campaigns =
    (lead.campaigns as {
      clubId: string;
      packageKey: string;
      quantity: number;
    }[]) ?? [];

  const clubIds = campaigns.map((c) => c.clubId);

  const { data: clubs } = await supabaseAdmin
    .from("clubs")
    .select("id,name")
    .in("id", clubIds);

    const { data: orders } = await supabaseAdmin
  .from("advertisement_orders")
  .select("id")
  .eq("lead_id", lead.id);

  const orderIds =
  orders?.map((o) => o.id) ?? [];

    const { data: advertisements } =
  orderIds.length === 0
    ? { data: [] }
    : await supabaseAdmin
        .from("company_advertisements")
        .select(`
          id,
          club_id,
          status,
          start_date,
          end_date,
          advertisement_packages!inner (
            id,
            name,
            price
          )
        `)
        .in("order_id", orderIds);

    const packagePrices = {
  partner: 350,
  spotlight: 750,
  premium: 1250,
};

const packageLabels = {
  partner: "Partner",
  spotlight: "Spotlight",
  premium: "Premium",
};

const grandTotal = campaigns.reduce((sum, campaign) => {
  const price =
    packagePrices[
      campaign.packageKey as keyof typeof packagePrices
    ] ?? 0;

  return sum + price * (campaign.quantity ?? 1);
}, 0);

  return (
    <div className="p-8 space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-white">
          {lead.company_name}
        </h1>

        <p className="text-white/70 mt-2">
          Advertisement Lead
        </p>
      </div>

      <div className="rounded-xl bg-white p-6">

        <h2 className="text-xl font-semibold mb-4">
          Bedrijfsgegevens
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <strong>Bedrijf</strong>
            <div>{lead.company_name}</div>
          </div>

          <div>
            <strong>Contactpersoon</strong>
            <div>{lead.contact_name}</div>
          </div>

          <div>
            <strong>E-mail</strong>
            <div>{lead.company_email}</div>
          </div>

          <div>
            <strong>Website</strong>
            <div>{lead.company_website || "-"}</div>
          </div>

          <div>
            <strong>Vacature</strong>
            <div>{lead.vacancy_url || "-"}</div>
          </div>

          <div>
  <strong>Status</strong>

  <div className="mt-1">
    <StatusBadge
      status={lead.status}
    />
  </div>
</div>

        </div>

      </div>

      <div className="rounded-xl bg-white p-6">

        <h2 className="text-xl font-semibold mb-4">
          Campagnes
        </h2>

        <table className="w-full">

          <thead className="border-b">
  <tr>
    <th className="text-left py-2">
      Club
    </th>

    <th className="text-left py-2">
      Pakket
    </th>

    <th className="text-center py-2">
      Aantal
    </th>

    <th className="text-right py-2">
      Prijs
    </th>

    <th className="text-right py-2">
      Totaal
    </th>
  </tr>
</thead>

          <tbody>

            {campaigns.map((campaign, index) => {

              const club = clubs?.find(
                (c) => c.id === campaign.clubId
              );

              const price =
  packagePrices[
    campaign.packageKey as keyof typeof packagePrices
  ] ?? 0;

const total =
  price * (campaign.quantity ?? 1);

              return (
                <tr
                  key={index}
                  className="border-b"
                >
                  <td className="py-3">
                    {club?.name ?? campaign.clubId}
                  </td>

                  <td className="py-3">
  {
    packageLabels[
      campaign.packageKey as keyof typeof packageLabels
    ]
  }
</td>

<td className="py-3 text-center">
  {campaign.quantity}
</td>

<td className="py-3 text-right">
  € {price.toLocaleString("nl-NL")}
</td>

<td className="py-3 text-right font-semibold">
  € {total.toLocaleString("nl-NL")}
</td>
                </tr>
              );
            })}

          </tbody>

        </table>

<div className="mt-6 flex justify-end">

  <div className="text-right">

    <div className="text-gray-500">
      Totale orderwaarde
    </div>

    <div className="text-3xl font-bold text-[#1f9d55]">
      € {grandTotal.toLocaleString("nl-NL")}
    </div>

  </div>

</div>

</div>

<div className="rounded-xl bg-white p-6">

  <h2 className="text-xl font-semibold mb-4">
    Aangemaakte advertenties
  </h2>

  {!advertisements?.length ? (

    <p className="text-gray-500">
      Er zijn nog geen advertenties aangemaakt.
    </p>

  ) : (

    <table className="w-full">

      <thead className="border-b">

        <tr>

  <th className="text-left py-2">
    Club
  </th>

  <th className="text-left py-2">
    Pakket
  </th>

  <th className="text-right py-2">
    Prijs
  </th>

  <th className="text-left py-2">
    Status
  </th>

  <th className="text-left py-2">
    Start
  </th>

  <th className="text-left py-2">
    Eind
  </th>

</tr>

      </thead>

      <tbody>

        {advertisements.map((advertisement) => {

          const club = clubs?.find(
            (c) => c.id === advertisement.club_id
          );

          return (

            <tr
              key={advertisement.id}
              className="border-b"
            >

              <td className="py-3">
                {club?.name ?? advertisement.club_id}
              </td>

              <td className="py-3">
  {advertisement.advertisement_packages?.[0]?.name ?? "-"}
</td>

<td className="py-3 text-right font-medium">
  €{" "}
  {advertisement.advertisement_packages?.[0]?.price?.toLocaleString("nl-NL") ??
    "-"}
</td>

              <td className="py-3">
  <StatusBadge
    status={advertisement.status}
  />
</td>

              <td className="py-3">
                {advertisement.start_date
                  ? new Date(
                      advertisement.start_date
                    ).toLocaleDateString("nl-NL")
                  : "-"}
              </td>

              <td className="py-3">
                {advertisement.end_date
                  ? new Date(
                      advertisement.end_date
                    ).toLocaleDateString("nl-NL")
                  : "-"}
              </td>

            </tr>

          );

        })}

      </tbody>

    </table>

  )}

</div>

    </div>
  );
}