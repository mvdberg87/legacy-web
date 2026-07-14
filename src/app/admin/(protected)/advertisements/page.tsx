"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import LoadingCard from "@/components/ui/LoadingCard";
import EmptyState from "@/components/ui/EmptyState";
import ErrorCard from "@/components/ui/ErrorCard";
import { toast } from "sonner";
import { useConfirm } from "@/components/providers/confirm-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

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
  const variants: Record<string, string> = {
    pending_activation:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",

    active:
      "bg-green-100 text-green-800 hover:bg-green-100",

    expired:
      "bg-red-100 text-red-800 hover:bg-red-100",

    rejected:
      "bg-red-100 text-red-800 hover:bg-red-100",

    archived:
      "bg-gray-200 text-gray-700 hover:bg-gray-200",

    inactive:
      "bg-gray-100 text-gray-700 hover:bg-gray-100",
  };

  const labels: Record<string, string> = {
    pending_activation: "Pending",
    active: "Actief",
    expired: "Verlopen",
    rejected: "Afgekeurd",
    archived: "Gearchiveerd",
    inactive: "Inactief",
  };

  return (
    <Badge
      className={variants[status] ?? ""}
    >
      {labels[status] ?? status}
    </Badge>
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

    const [error, setError] =
  useState<string | null>(null);

    const [editingAd, setEditingAd] =
  useState<Advertisement | null>(null);

  const [rejectingAd, setRejectingAd] =
  useState<Advertisement | null>(null);

const [rejectionReason, setRejectionReason] =
  useState("");

const [editCompanyName, setEditCompanyName] =
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

const { confirm } = useConfirm();

    function rejectAdvertisement(ad: Advertisement) {
  setRejectingAd(ad);
  setRejectionReason("");
}

async function confirmRejectAdvertisement() {
  if (!rejectingAd) return;

  if (!rejectionReason.trim()) {
    toast.error("Vul een reden in.");
    return;
  }

  const response = await fetch(
    "/api/admin/advertisements/reject",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        advertisementId: rejectingAd.id,
        rejectionReason: rejectionReason,
      }),
    }
  );

  if (!response.ok) {
    toast.error("Afkeuren mislukt.");
    return;
  }

  await load();

  setRejectingAd(null);
  setRejectionReason("");

  toast.success("Advertentie afgekeurd.");
}

async function toggleFeatured(
  advertisementId: string,
  currentValue: boolean
) {
  const response = await fetch(
  "/api/admin/advertisements/highlight",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      advertisementId,
      isFeatured: !currentValue,
    }),
  }
);

if (!response.ok) {
  toast.error("Bijwerken mislukt.");
  return;
}

await load();

toast.success("Featured-status bijgewerkt.");
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
    toast.error("Opslaan mislukt");
    return;
  }

  await load();

setEditingAd(null);

toast.success("Advertentie opgeslagen.");
}

async function archiveAdvertisement(
  advertisementId: string
) {
  const confirmed = await confirm({
  title: "Advertentie archiveren",
  description:
    "Weet je zeker dat je deze advertentie wilt archiveren?",
  confirmText: "Archiveren",
  cancelText: "Annuleren",
});

if (!confirmed) return;

  const response = await fetch(
  "/api/admin/advertisements/archive",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      advertisementId,
    }),
  }
);

if (!response.ok) {
  toast.error("Archiveren mislukt.");
  return;
}

await load();

toast.success("Advertentie gearchiveerd.");
}

async function restoreAdvertisement(
  advertisementId: string
) {
  const response = await fetch(
  "/api/admin/advertisements/restore",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      advertisementId,
    }),
  }
);

if (!response.ok) {
  toast.error("Herstellen mislukt.");
  return;
}

await load();

toast.success("Advertentie hersteld.");
}

async function toggleRenewal(
  advertisementId: string,
  currentValue: boolean
) {

  const response = await fetch(
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

  if (!response.ok) {
  toast.error("Wijzigen mislukt.");
  return;
}

await load();

toast.success("Automatische verlenging bijgewerkt.");
}

    async function activateAdvertisement(
  advertisementId: string
) {
  const confirmed = await confirm({
  title: "Advertentie activeren",
  description:
    "Wil je deze advertentie activeren?",
  confirmText: "Activeren",
  cancelText: "Annuleren",
});

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
  toast.error(
    result.error ||
    "Activatie mislukt"
  );

  return;
}

  await load();

toast.success("Advertentie geactiveerd");
}

  async function load() {

  setLoading(true);

  try {

    const { data, error } =
      await supabase
        .from("admin_advertisements_overview")
        .select("*")
        .order("end_date", {
          ascending: true,
        });

    if (error) throw error;

    setAds(data ?? []);

  } catch (err: any) {

    setError(
      err.message ??
      "Er ging iets mis."
    );

    setAds([]);

  } finally {

    setLoading(false);

  }

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

  return (

    <LoadingCard rows={8} />

  );

}

if (error) {

  return (

    <ErrorCard
      message={error}
    />

  );

}

  return (
    <div className="bg-white text-black rounded-2xl shadow p-6">

      <h1 className="text-xl font-semibold mb-6">
        Advertentiebeheer
      </h1>

      <div className="flex gap-2 mb-6 flex-wrap">

  <Button
  variant={filter === "all" ? "default" : "outline"}
  onClick={() => setFilter("all")}
>
  Alle
</Button>

  <Button
  variant={
    filter === "pending_activation"
      ? "default"
      : "outline"
  }
  onClick={() => setFilter("pending_activation")}
>
  Pending
</Button>

  <Button
    variant={filter === "active" ? "default" : "outline"}
    onClick={() => setFilter("active")}
>
    Actief
</Button>

  <Button
  variant={
    filter === "rejected"
      ? "default"
      : "outline"
  }
  onClick={() => setFilter("rejected")}
>
  Afgekeurd
</Button>

  <Button
  variant={
    filter === "archived"
      ? "default"
      : "outline"
  }
  onClick={() => setFilter("archived")}
>
  Gearchiveerd
</Button>

</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">

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

        <table className="min-w-[1000px] text-sm">

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

  {filteredAds.length === 0 ? (

    <tr>

      <td
        colSpan={11}
        className="p-6"
      >

        <EmptyState
          title="Geen advertenties"
          description="Er zijn geen advertenties gevonden."
        />

      </td>

    </tr>

  ) : (

    filteredAds.map((ad) => (

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
  <Button
    size="sm"
    variant={ad.auto_renew ? "default" : "secondary"}
    onClick={() =>
        toggleRenewal(ad.id, ad.auto_renew)
    }
>
    {ad.auto_renew ? "AAN" : "UIT"}
</Button>
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

    <div className="flex flex-wrap justify-center gap-2">

  <Button
  size="sm"
  className="bg-green-600 hover:bg-green-700"
  onClick={() => activateAdvertisement(ad.id)}
>
  Activeer
</Button>

  <Button
    size="sm"
    variant="destructive"
    onClick={() => rejectAdvertisement(ad)}
>
    Afkeuren
</Button>

  <Button
    size="icon"
    variant="secondary"
    onClick={() =>
        toggleFeatured(ad.id, ad.is_featured)
    }
>
    ⭐
</Button>

<Button
    size="icon"
    variant="secondary"
    onClick={() =>
        archiveAdvertisement(ad.id)
    }
>
    🗑️
</Button>

</div>

  )}

  

  {ad.status === "active" && (

  <div className="flex justify-center gap-2">

    <Button
  size="icon"
  variant="secondary"
  onClick={() =>
    toggleFeatured(ad.id, ad.is_featured)
  }
>
  ⭐
</Button>

    <Button
  size="icon"
  variant="outline"
  onClick={() => {
    setEditingAd(ad);

    setEditJobTitle(ad.job_title ?? "");
    setEditCompanyName(ad.company_name ?? "");
    setEditVacancyUrl(ad.vacancy_url ?? "");
    setEditPackageName(ad.package_name ?? "");
  }}
>
  ✏️
</Button>

    <Button
    size="icon"
    variant="secondary"
    onClick={() =>
        archiveAdvertisement(ad.id)
    }
>
    📦
</Button>

  </div>

)}

  {ad.status === "rejected" && (
  <span className="text-red-600 text-xs font-medium">
    Afgekeurd
  </span>
)}

{ad.status === "archived" && (

  <Button
    size="sm"
    variant="default"
    onClick={() =>
        restoreAdvertisement(ad.id)
    }
>
    ↩️ Herstel
</Button>

)}

</td>

              </tr>

))

  )}
            
            </tbody> 

        </table>

      </div>

      <Dialog
  open={!!editingAd}
  onOpenChange={(open) => {
    if (!open) setEditingAd(null);
  }}
>

<DialogContent className="max-w-lg">

  <div className="space-y-4">

<DialogHeader>

  <DialogTitle>
    Advertentie bewerken
  </DialogTitle>

  <DialogDescription>
    Pas de vacaturegegevens hieronder aan.
  </DialogDescription>

</DialogHeader>

      <Label>Vacaturetitel</Label>

<Input
  value={editJobTitle}
  onChange={(e) => setEditJobTitle(e.target.value)}
/>

<Label>Bedrijfsnaam</Label>

<Input
  value={editCompanyName}
  onChange={(e) => setEditCompanyName(e.target.value)}
/>

<Label>Vacature URL</Label>

<Input
  value={editVacancyUrl}
  onChange={(e) => setEditVacancyUrl(e.target.value)}
/>

<Label>Pakket</Label>

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

      <DialogFooter>

<Button
  variant="outline"
  onClick={() => setEditingAd(null)}
>
  Annuleren
</Button>

<Button onClick={saveAdvertisement}>
  Opslaan
</Button>

</DialogFooter>

</div>

    </DialogContent>

</Dialog>

<Dialog
  open={!!rejectingAd}
  onOpenChange={(open) => {
    if (!open) {
      setRejectingAd(null);
      setRejectionReason("");
    }
  }}
>
  <DialogContent className="max-w-lg">

    <DialogHeader>
      <DialogTitle>
        Advertentie afkeuren
      </DialogTitle>

      <DialogDescription>
        Geef de reden op waarom deze advertentie wordt afgekeurd.
      </DialogDescription>
    </DialogHeader>

    <Textarea
  rows={5}
  value={rejectionReason}
  onChange={(e) => setRejectionReason(e.target.value)}
/>

    <DialogFooter>

      <Button
  variant="outline"
  onClick={() => {
    setRejectingAd(null);
    setRejectionReason("");
  }}
>
  Annuleren
</Button>

<Button
  variant="destructive"
  onClick={confirmRejectAdvertisement}
>
  Afkeuren
</Button>

    </DialogFooter>

  </DialogContent>
</Dialog>

    </div>
  );
}