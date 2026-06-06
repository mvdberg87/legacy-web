"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

type Advertisement = {
  id: string;

  club_name: string;
  slug: string;

  company_name: string;
  company_email: string;

  package_name: string | null;

  status: string;

  start_date: string;
  end_date: string;

  amount: number;
  club_amount: number;
  platform_amount: number;
};

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    pending_activation:
      "bg-yellow-100 text-yellow-800",

    active:
      "bg-green-100 text-green-800",

    expired:
      "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        styles[status] ??
        "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminAdvertisementsPage() {
  const supabase = useMemo(
    () => getSupabaseBrowser(),
    []
  );

  const [ads, setAds] = useState<
    Advertisement[]
  >([]);

  const [loading, setLoading] =
    useState(true);

    async function activateAdvertisement(
  advertisementId: string
) {
  const confirmed = confirm(
    "Advertentie activeren?"
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("company_advertisements")
    .update({
      status: "active",
      activated_at:
        new Date().toISOString(),
    })
    .eq("id", advertisementId);

  if (error) {
    console.error(error);
    alert("Activatie mislukt");
    return;
  }

  alert("Advertentie geactiveerd");

await load();
}

  async function load() {
    setLoading(true);

    const { data, error } =
      await supabase
        .from(
          "admin_advertisements_overview"
        )
        .select("*")
        .order("end_date", {
          ascending: true,
        });

    if (error) {
      console.error(error);
      setAds([]);
    } else {
      setAds(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <p>Laden...</p>;
  }

  return (
    <div className="bg-white text-black rounded-2xl shadow p-6">

      <h1 className="text-xl font-semibold mb-6">
        Advertentiebeheer
      </h1>

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-[#0d1b2a] text-white text-xs uppercase">

            <tr>
              <th className="px-4 py-3 text-left">
                Bedrijf
              </th>

              <th className="px-4 py-3 text-left">
                Club
              </th>

              <th className="px-4 py-3 text-center">
                Pakket
              </th>

              <th className="px-4 py-3 text-center">
                Status
              </th>

              <th className="px-4 py-3 text-center">
                Loopt tot
              </th>

              <th className="px-4 py-3 text-center">
                Omzet
              </th>

              <th className="px-4 py-3 text-center">
                Club
              </th>

              <th className="px-4 py-3 text-center">
  Sponsuls
</th>

<th className="px-4 py-3 text-center">
  Actie
</th>
            </tr>

          </thead>

          <tbody>

            {ads.map((ad) => (

              <tr
                key={ad.id}
                className="border-b"
              >

                <td className="px-4 py-3">
                  <div className="font-medium">
                    {ad.company_name}
                  </div>

                  <div className="text-xs text-gray-500">
                    {ad.company_email}
                  </div>
                </td>

                <td className="px-4 py-3">
                  {ad.club_name}
                </td>

                <td className="px-4 py-3 text-center">
                  {ad.package_name}
                </td>

                <td className="px-4 py-3 text-center">
                  <StatusBadge
                    status={ad.status}
                  />
                </td>

                <td className="px-4 py-3 text-center">
                  {new Date(
                    ad.end_date
                  ).toLocaleDateString(
                    "nl-NL"
                  )}
                </td>

                <td className="px-4 py-3 text-center">
                  € {ad.amount}
                </td>

                <td className="px-4 py-3 text-center text-green-700">
                  € {ad.club_amount}
                </td>

                <td className="px-4 py-3 text-center text-blue-700">
                  € {ad.platform_amount}
                </td>

                <td className="px-4 py-3 text-center">

  {ad.status ===
    "pending_activation" && (

    <button
      onClick={() =>
        activateAdvertisement(ad.id)
      }
      className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
    >
      Activeer
    </button>

  )}

  {ad.status === "active" && (
    <span className="text-green-600 text-xs font-medium">
      Actief
    </span>
  )}

</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}