"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

type Advertisement = {
  id: string;

  club_name: string;
  slug: string;

  job_title: string | null;

  company_name: string;
  company_email: string;
  company_website: string | null;
vacancy_url: string | null;

  package_name: string | null;

  status: string;

  start_date: string;
  end_date: string;

  amount: number;
  club_amount: number;
  platform_amount: number;

  is_featured: boolean;
  auto_renew: boolean;
  archived_at: string | null;
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

  archived:
  "bg-gray-200 text-gray-700",

  inactive:
  "bg-gray-100 text-gray-700",
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

    const [editingAd, setEditingAd] =
  useState<Advertisement | null>(null);

const [editCompanyName, setEditCompanyName] =
  useState("");

const [editWebsite, setEditWebsite] =
  useState("");

  const [editJobTitle, setEditJobTitle] =
  useState("");

const [editVacancyUrl, setEditVacancyUrl] =
  useState("");

  const [editPackageName, setEditPackageName] =
  useState("");

    const [filter, setFilter] = useState<
  | "all"
  | "pending_activation"
  | "active"
  | "rejected"
  | "archived"
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

async function saveAdvertisement() {

  if (!editingAd) return;

  const response = await fetch(
    "/api/admin/advertisements/update",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
  advertisementId: editingAd.id,

  jobTitle: editJobTitle,

  companyName: editCompanyName,

  vacancyUrl: editVacancyUrl,

  packageName: editPackageName,
}),
    }
  );

  if (!response.ok) {
    alert("Opslaan mislukt");
    return;
  }

  setEditingAd(null);

  await load();
}

async function archiveAdvertisement(
  advertisementId: string
) {
  const confirmed = confirm(
    "Advertentie archiveren?"
  );

  if (!confirmed) return;

  await fetch(
    "/api/admin/advertisements/archive",
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

async function restoreAdvertisement(
  advertisementId: string
) {
  await fetch(
    "/api/admin/advertisements/restore",
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

async function toggleRenewal(
  advertisementId: string,
  currentValue: boolean
) {

  await fetch(
    "/api/admin/advertisements/toggle-renewal",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        advertisementId,
        autoRenew: !currentValue,
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

  const today = new Date();

const expiresIn90Days = ads.filter((a) => {
  if (
    a.status !== "active" ||
    a.deleted_at
  )
    return false;

  const endDate = new Date(
    a.end_date
  );

  const diff =
    (endDate.getTime() -
      today.getTime()) /
    (1000 * 60 * 60 * 24);

  return diff <= 90 && diff > 60;
});

const expiresIn60Days = ads.filter((a) => {
  if (
    a.status !== "active" ||
    a.deleted_at
  )
    return false;

  const endDate = new Date(
    a.end_date
  );

  const diff =
    (endDate.getTime() -
      today.getTime()) /
    (1000 * 60 * 60 * 24);

  return diff <= 60 && diff > 30;
});

const expiresIn30Days = ads.filter((a) => {
  if (
    a.status !== "active" ||
    a.deleted_at
  )
    return false;

  const endDate = new Date(
    a.end_date
  );

  const diff =
    (endDate.getTime() -
      today.getTime()) /
    (1000 * 60 * 60 * 24);

  return diff <= 30 && diff >= 0;
});

const expiredAds = ads.filter((a) => {
  if (a.status === "archived") return false;

  return (
    new Date(a.end_date) < today
  );
});

  const filteredAds = ads.filter(
  (ad) => {

    if (filter === "all") {
  return ad.status !== "archived";
}

if (filter === "archived") {
  return ad.status === "archived";
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
      setFilter("archived")
    }
    className="px-4 py-2 border rounded"
  >
    Gearchiveerd
  </button>

</div>

<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-4 mb-6">

  <div className="border rounded p-4">
    <div className="text-2xl font-bold">
      {
        ads.filter(
  a =>
    a.status === "pending_activation"
).length
      }
    </div>
    <div className="text-sm whitespace-nowrap">Pending</div>
  </div>

  <div className="border rounded p-4">
    <div className="text-2xl font-bold">
      {
        ads.filter(
          a => a.status === "active"
        ).length
      }
    </div>
    <div className="text-sm whitespace-nowrap">Actief</div>
  </div>

  <div className="border rounded p-4">
  <div className="text-2xl font-bold">
    {expiresIn90Days.length}
  </div>

  <div className="text-sm whitespace-nowrap">&lt; 90 dagen</div>
</div>

<div className="border rounded p-4">
  <div className="text-2xl font-bold">
    {expiresIn60Days.length}
  </div>

  <div className="text-sm whitespace-nowrap">&lt; 60 dagen</div>
</div>

<div className="border rounded p-4">
  <div className="text-2xl font-bold">
    {expiresIn30Days.length}
  </div>

  <div className="text-sm whitespace-nowrap">&lt; 30 dagen</div>
</div>

  <div className="border rounded p-4">
    <div className="text-2xl font-bold">
      {
        ads.filter(
  a =>
    a.status === "rejected"
).length
      }
    </div>
    <div className="text-sm whitespace-nowrap">Afgekeurd</div>
  </div>

  <div className="border rounded p-4">
    <div className="text-2xl font-bold">
      {
        ads.filter(
  a =>
    a.is_featured &&
a.status !== "archived"
).length
      }
    </div>
    <div className="text-sm whitespace-nowrap">Featured</div>
  </div>

  <div className="border rounded p-4">
  <div className="text-2xl font-bold">
    {expiredAds.length}
  </div>

  <div className="text-sm whitespace-nowrap">Verlopen</div>
</div>

<div className="border rounded p-4">
  <div className="text-2xl font-bold">
    {
      ads.filter(
  a => a.status === "archived"
).length
    }
  </div>

  <div className="text-sm whitespace-nowrap">Gearchiveerd</div>
</div>

</div>

      <div className="overflow-x-auto">

        <table className="min-w-[1400px] text-sm">

          <thead className="bg-[#0d1b2a] text-white text-xs uppercase">

            <tr>
              <th className="px-4 py-3 text-left">
                Club
              </th>

              <th className="px-4 py-3 text-left">
                Advertentie
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
  Verlenging
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
  {ad.club_name}
</td>

<td className="px-4 py-3">
  <div className="font-medium">
    {ad.job_title ?? "Geen functietitel"}
  </div>

  <div className="text-xs text-gray-500">
    {ad.company_name}
  </div>
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
  <button
    onClick={() =>
      toggleRenewal(
        ad.id,
        ad.auto_renew
      )
    }
    className={`px-3 py-1 rounded text-xs font-medium ${
      ad.auto_renew
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    }`}
  >
    {ad.auto_renew ? "AAN" : "UIT"}
  </button>
</td>

                <td className="px-4 py-3 text-center">
  <div>
    {new Date(
      ad.end_date
    ).toLocaleDateString(
      "nl-NL"
    )}
  </div>

  {!ad.auto_renew && (
    <div className="text-xs text-orange-600">
      Opgezegd
    </div>
  )}
</td>

                <td className="px-4 py-3 text-center">
  € {Number(ad.amount).toLocaleString("nl-NL")}
</td>

<td className="px-4 py-3 text-center text-green-700">
  € {Number(ad.club_amount).toLocaleString("nl-NL")}
</td>

<td className="px-4 py-3 text-center text-blue-700">
  € {Number(ad.platform_amount).toLocaleString("nl-NL")}
</td>

                <td className="px-4 py-3 text-center">

  {ad.status === "pending_activation" && (

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
    archiveAdvertisement(ad.id)
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
  onClick={() => {
    setEditingAd(ad);

setEditJobTitle(
  ad.job_title ?? ""
);

setEditCompanyName(
  ad.company_name ?? ""
);

setEditVacancyUrl(
  ad.vacancy_url ?? ""
);

setEditPackageName(
  ad.package_name ?? ""
);
  }}
  className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
>
  ✏️

</button>

    <button
  onClick={() =>
    archiveAdvertisement(ad.id)
  }
  className="bg-gray-700 text-white px-3 py-1 rounded text-xs"
>
  📦
</button>

  </div>

)}

  {ad.status === "rejected" && (
  <span className="text-red-600 text-xs font-medium">
    Afgekeurd
  </span>
)}

{ad.status === "archived" && (

  <button
    onClick={() =>
      restoreAdvertisement(ad.id)
    }
    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
  >
    ↩️ Herstel
  </button>

)}

</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {editingAd && (

  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white rounded-xl p-6 w-full max-w-lg">

      <h2 className="text-lg font-semibold mb-4">
        Advertentie bewerken
      </h2>

      <label className="block text-sm font-medium mb-1">
  Vacaturetitel
</label>

<input
  value={editJobTitle}
  onChange={(e) =>
    setEditJobTitle(e.target.value)
  }
  className="w-full border rounded p-2 mb-3"
/>

<label className="block text-sm font-medium mb-1">
  Bedrijfsnaam
</label>

<input
  value={editCompanyName}
  onChange={(e) =>
    setEditCompanyName(e.target.value)
  }
  className="w-full border rounded p-2 mb-3"
/>

<label className="block text-sm font-medium mb-1">
  Vacature URL
</label>

<input
  value={editVacancyUrl}
  onChange={(e) =>
    setEditVacancyUrl(e.target.value)
  }
  className="w-full border rounded p-2 mb-3"
/>

<label className="block text-sm font-medium mb-1">
  Pakket
</label>

<select
  value={editPackageName}
  onChange={(e) =>
    setEditPackageName(e.target.value)
  }
  className="w-full border rounded p-2 mb-4"
>
  <option value="partner">
    Partner
  </option>

  <option value="spotlight">
    Spotlight
  </option>

  <option value="premium">
    Premium
  </option>
</select>

      <div className="flex justify-end gap-2">

        <button
          onClick={() =>
            setEditingAd(null)
          }
          className="px-4 py-2 border rounded"
        >
          Annuleren
        </button>

        <button
          onClick={saveAdvertisement}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Opslaan
        </button>

      </div>

    </div>

  </div>

)}

    </div>
  );
}