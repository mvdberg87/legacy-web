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

  is_featured: boolean;
  deleted_at: string | null;
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

      rejected:
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

    const [filter, setFilter] = useState<
  | "all"
  | "pending_activation"
  | "active"
  | "rejected"
  | "deleted"
>("all");

    async function rejectAdvertisement(
  advertisementId: string
) {

  const reason = prompt(
    "Reden van afkeuren?"
  );

  if (!reason) return;

  const response = await fetch(
    "/api/admin/advertisements/reject",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        advertisementId,
        rejectionReason: reason,
      }),
    }
  );

  if (!response.ok) {
    alert("Afkeuren mislukt");
    return;
  }

  alert("Advertentie afgekeurd");

  await load();
}

async function toggleFeatured(
  advertisementId: string,
  currentValue: boolean
) {
  await fetch(
    "/api/admin/advertisements/highlight",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        advertisementId,
        isFeatured: !currentValue,
      }),
    }
  );

  await load();
}

async function deleteAdvertisement(
  advertisementId: string
) {
  const confirmed = confirm(
    "Advertentie verwijderen?"
  );

  if (!confirmed) return;

  await fetch(
    "/api/admin/advertisements/delete",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        advertisementId,
      }),
    }
  );

  await load();
}

    async function activateAdvertisement(
  advertisementId: string
) {
  const confirmed = confirm(
    "Advertentie activeren?"
  );

  if (!confirmed) return;

  const response = await fetch(
  "/api/admin/advertisements/activate",
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({
      advertisementId,
    }),
  }
);

const result =
  await response.json();

if (!response.ok) {
  alert(
    result.error ||
    "Activatie mislukt"
  );

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

  const filteredAds = ads.filter(
  (ad) => {

    if (filter === "all") {
      return true;
    }

    if (filter === "deleted") {
      return !!ad.deleted_at;
    }

    return ad.status === filter;
  }
);

  if (loading) {
    return <p>Laden...</p>;
  }

  return (
    <div className="bg-white text-black rounded-2xl shadow p-6">

      <h1 className="text-xl font-semibold mb-6">
        Advertentiebeheer
      </h1>

      <div className="flex gap-2 mb-6 flex-wrap">

  <button
    onClick={() => setFilter("all")}
    className="px-4 py-2 border rounded"
  >
    Alle
  </button>

  <button
    onClick={() =>
      setFilter("pending_activation")
    }
    className="px-4 py-2 border rounded"
  >
    Pending
  </button>

  <button
    onClick={() =>
      setFilter("active")
    }
    className="px-4 py-2 border rounded"
  >
    Actief
  </button>

  <button
    onClick={() =>
      setFilter("rejected")
    }
    className="px-4 py-2 border rounded"
  >
    Afgekeurd
  </button>

  <button
    onClick={() =>
      setFilter("deleted")
    }
    className="px-4 py-2 border rounded"
  >
    Verwijderd
  </button>

</div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

  <div className="border rounded p-4">
    <div className="text-2xl font-bold">
      {
        ads.filter(
          a =>
            a.status ===
            "pending_activation"
        ).length
      }
    </div>
    <div>Pending</div>
  </div>

  <div className="border rounded p-4">
    <div className="text-2xl font-bold">
      {
        ads.filter(
          a => a.status === "active"
        ).length
      }
    </div>
    <div>Actief</div>
  </div>

  <div className="border rounded p-4">
    <div className="text-2xl font-bold">
      {
        ads.filter(
          a => a.status === "rejected"
        ).length
      }
    </div>
    <div>Afgekeurd</div>
  </div>

  <div className="border rounded p-4">
    <div className="text-2xl font-bold">
      {
        ads.filter(
          a => a.is_featured
        ).length
      }
    </div>
    <div>Featured</div>
  </div>

</div>

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
  Featured
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

            {filteredAds.map((ad) => (

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
  {ad.is_featured ? "⭐" : "-"}
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

    <div className="flex justify-center gap-2">

  <button
    onClick={() =>
      activateAdvertisement(ad.id)
    }
    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
  >
    Activeer
  </button>

  <button
    onClick={() =>
      rejectAdvertisement(ad.id)
    }
    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
  >
    Afkeuren
  </button>

  <button
  onClick={() =>
    toggleFeatured(
      ad.id,
      ad.is_featured
    )
  }
  className="bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600"
>
  ⭐
</button>

<button
  onClick={() =>
    deleteAdvertisement(ad.id)
  }
  className="bg-gray-700 text-white px-3 py-1 rounded text-xs hover:bg-gray-800"
>
  🗑️
</button>

</div>

  )}

  {ad.status === "active" && (

  <div className="flex justify-center gap-2">

    <button
      onClick={() =>
        toggleFeatured(
          ad.id,
          ad.is_featured
        )
      }
      className={`px-3 py-1 rounded text-xs text-white ${
        ad.is_featured
          ? "bg-yellow-600"
          : "bg-yellow-500"
      }`}
    >
      ⭐
    </button>

    <button
  className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
>
  ✏️
</button>

    <button
      onClick={() =>
        deleteAdvertisement(ad.id)
      }
      className="bg-gray-700 text-white px-3 py-1 rounded text-xs hover:bg-gray-800"
    >
      🗑️
    </button>

  </div>

)}

  {ad.status === "rejected" && (
  <span className="text-red-600 text-xs font-medium">
    Afgekeurd
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