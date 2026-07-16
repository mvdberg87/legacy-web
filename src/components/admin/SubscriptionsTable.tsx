"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/providers/confirm-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ===============================
   Types
   =============================== */

type SubscriptionStatus =
  | "trial"
  | "active"
  | "cancelled"
  | "blocked"
  | "expired"
  | "pending_payment";

type Club = {
  id: string;
  name: string;
  email: string | null;

  active_package: string;

  subscription_status: SubscriptionStatus | null;
  billing_status: string | null;

  subscription_start: string | null;
  subscription_end: string | null;

  trial_active: boolean | null;

  billing_override: boolean;
};

type SubscriptionEvent = {
  id: string;
  event_type: string;
  old_package: string | null;
  new_package: string | null;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
};

/* ===============================
   Status labels & styles
   =============================== */

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  trial: "Proefperiode",
  active: "Actief",
  blocked: "Geblokkeerd",
  expired: "Verlopen",
  cancelled: "Opgezegd",
  pending_payment: "Wacht op betaling",
};

const STATUS_STYLES: Record<SubscriptionStatus, string> = {
  trial: "bg-yellow-100 text-yellow-800",
  active: "bg-green-100 text-green-800",
  blocked: "bg-red-100 text-red-800",
  expired: "bg-gray-200 text-gray-800",
  cancelled: "bg-slate-200 text-slate-700",
  pending_payment: "bg-orange-100 text-orange-800",
};

/* ===============================
   Status logica
   =============================== */

function getComputedStatus(
  club: Club
): SubscriptionStatus | null {

  if (club.subscription_status === "blocked")
    return "blocked";

  if (club.subscription_status === "cancelled")
    return "cancelled";

  if (club.subscription_status === "expired")
    return "expired";

  if (club.billing_override)
    return "active";

  if (
    club.active_package !== "basic" &&
    club.billing_status !== "active"
  ) {
    return "pending_payment";
  }

  if (club.billing_status === "active")
    return "active";

  return "trial";
}


/* ===============================
   Page
   =============================== */

   function getSubscriptionType(club: Club) {
  if (club.billing_override) {
  return {
    label: "🟣 Override",
    className:
      "bg-purple-100 text-purple-800",
  };
}

  if (club.billing_status === "active") {
    return {
      label: "Betaald",
      className:
        "bg-green-100 text-green-800",
    };
  }

  return {
    label: "Trial",
    className:
      "bg-yellow-100 text-yellow-800",
  };
}

export default function SubscriptionsTable() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] =
    useState<SubscriptionStatus | "all">("all");

  const [openClubId, setOpenClubId] = useState<string | null>(null);
  const [events, setEvents] = useState<
    Record<string, SubscriptionEvent[]>
  >({});
  const [eventsLoading, setEventsLoading] = useState<string | null>(null);
  const { confirm } = useConfirm();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/subscriptions");
    const data = await res.json();
    setClubs(data.clubs ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  /* ===============================
     Acties
     =============================== */

  async function unblockClub(clubId: string) {
    const confirmed = await confirm({
  title: "Blokkade opheffen",
  description: "Wil je de blokkade van deze club opheffen?",
  confirmText: "Deblokkeren",
  cancelText: "Annuleren",
});

if (!confirmed) return;
    await fetch("/api/admin/subscriptions/unblock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clubId }),
    });
    load();
  }

  async function blockClub(clubId: string) {
  const confirmed = await confirm({
  title: "Club blokkeren",
  description:
    "Weet je zeker dat je deze club wilt blokkeren?",
  confirmText: "Blokkeren",
  cancelText: "Annuleren",
  destructive: true,
});

if (!confirmed) return;

  await fetch(
    "/api/admin/subscriptions/block",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        clubId,
      }),
    }
  );

  load();
}

  async function adminOverrideActivate(clubId: string) {
    const confirmed = await confirm({
  title: "Admin override",
  description:
    "Het abonnement wordt geactiveerd zonder betaling.",
  confirmText: "Activeren",
  cancelText: "Annuleren",
});

if (!confirmed) return;

    await fetch("/api/admin/subscriptions/admin-override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clubId }),
    });

    load();
  }

  async function removeOverride(clubId: string) {
  const confirmed = await confirm({
  title: "Override verwijderen",
  description:
    "Wil je de admin override verwijderen?",
  confirmText: "Verwijderen",
  cancelText: "Annuleren",
  destructive: true,
});

if (!confirmed) return;

  await fetch(
    "/api/admin/subscriptions/remove-override",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        clubId,
      }),
    }
  );

  load();
}

  async function toggleHistory(clubId: string) {
    if (openClubId === clubId) {
      setOpenClubId(null);
      return;
    }

    setOpenClubId(clubId);

    if (!events[clubId]) {
      setEventsLoading(clubId);
      const res = await fetch(
        `/api/admin/subscriptions/events?clubId=${clubId}`
      );
      const data = await res.json();
      setEvents((prev) => ({
        ...prev,
        [clubId]: data.events ?? [],
      }));
      setEventsLoading(null);
    }
  }

  if (loading) {
    return <p>Laden…</p>;
  }

  const filteredClubs =
    statusFilter === "all"
      ? clubs
      : clubs.filter(
          (c) => getComputedStatus(c) === statusFilter
        );

  /* ===============================
     Render
     =============================== */

  return (
    <div className="space-y-8">
      <div className="bg-white text-black rounded-2xl shadow p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-xl font-semibold">
            Abonnementen & proefperiodes
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-sm font-medium">
              Filter op status:
            </label>
            <Select
  value={statusFilter}
  onValueChange={(value) =>
    setStatusFilter(value as SubscriptionStatus | "all")
  }
>
  <SelectTrigger className="w-56">
    <SelectValue placeholder="Filter op status" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="all">Alles</SelectItem>
    <SelectItem value="trial">Proefperiode</SelectItem>
    <SelectItem value="pending_payment">
      Wacht op betaling
    </SelectItem>
    <SelectItem value="active">Actief</SelectItem>
    <SelectItem value="blocked">Geblokkeerd</SelectItem>
    <SelectItem value="expired">Verlopen</SelectItem>
    <SelectItem value="cancelled">Opgezegd</SelectItem>
  </SelectContent>
</Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#0d1b2a] text-white text-xs uppercase">
              <tr>
                <th className="px-3 py-3 text-left">Club</th>
                <th className="px-3 py-3 text-center">Pakket</th>
                <th className="px-3 py-3 text-center">Status</th>
<th className="px-3 py-3 text-center">Type</th>
<th className="px-3 py-3 text-center">Start</th>
                <th className="px-3 py-3 text-center">Einde</th>
                <th className="px-3 py-3 text-center">Acties</th>
              </tr>
            </thead>

            {filteredClubs.map((c) => {
              const computedStatus = getComputedStatus(c);

              return (
                <tbody key={c.id}>
                  <tr className="border-b">
                    <td className="px-3 py-3">
                      <button
                        onClick={() => toggleHistory(c.id)}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {c.name}
                      </button>
                    </td>

                    <td className="px-3 py-3 text-center">
                      {c.active_package}
                    </td>

                    <td className="px-3 py-3 text-center">
  {computedStatus && (
    <>
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${STATUS_STYLES[computedStatus]}`}
      >
        {STATUS_LABELS[computedStatus]}
      </span>

      {computedStatus === "pending_payment" && (
        <div className="text-xs text-gray-500 mt-1 break-words max-w-[180px] mx-auto">
          Upgrade toegekend, betaling nog niet voldaan
        </div>
      )}
    </>
  )}
</td>

                    <td className="px-3 py-3 text-center">
  {(() => {
    const type =
      getSubscriptionType(c);

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${type.className}`}
      >
        {type.label}
      </span>
    );
  })()}
</td>

                    <td className="px-3 py-3 text-center">
                      {c.subscription_start
                        ? new Date(
                            c.subscription_start
                          ).toLocaleDateString("nl-NL")
                        : "—"}
                    </td>

                    <td className="px-3 py-3 text-center">
                      {c.subscription_end
                        ? new Date(
                            c.subscription_end
                          ).toLocaleDateString("nl-NL")
                        : "—"}
                    </td>

                   <td className="px-3 py-3 text-center">
  <div className="flex flex-wrap justify-center gap-2">

  {c.billing_override ? (

  <Button
    size="sm"
    variant="secondary"
    onClick={() => removeOverride(c.id)}
>
    ❌ Override uit
</Button>

) : computedStatus === "blocked" ? (

  <Button
  size="sm"
  className="bg-green-600 hover:bg-green-700"
  onClick={() => unblockClub(c.id)}
>
  🔓 Deblokkeren
</Button>

    

  ) : computedStatus === "pending_payment" ? (

    <Button
    size="sm"
    className="bg-orange-600 hover:bg-orange-700"
    onClick={() => adminOverrideActivate(c.id)}
>
    Admin Override
</Button>

  ) : (

    <Button
    size="sm"
    variant="destructive"
    onClick={() => blockClub(c.id)}
>
    🔒 Blokkeren
</Button>

  )}

  </div>

</td>
                  </tr>

                  {openClubId === c.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="p-4">
                        {eventsLoading === c.id ? (
                          <p className="text-sm">
                            Geschiedenis laden…
                          </p>
                        ) : (
                          <div className="overflow-x-auto">
  <table className="w-full text-xs border">
                            <thead className="bg-gray-200">
                              <tr>
                                <th className="px-2 py-1">
                                  Actie
                                </th>
                                <th className="px-2 py-1">
                                  Van
                                </th>
                                <th className="px-2 py-1">
                                  Naar
                                </th>
                                <th className="px-2 py-1">
                                  Periode
                                </th>
                                <th className="px-2 py-1">
                                  Datum
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {(events[c.id] ?? []).map((e) => (
                                <tr
                                  key={e.id}
                                  className="border-t"
                                >
                                  <td className="px-2 py-1">
                                    {e.event_type}
                                  </td>
                                  <td className="px-2 py-1">
                                    {e.old_package ?? "—"}
                                  </td>
                                  <td className="px-2 py-1">
                                    {e.new_package ?? "—"}
                                  </td>
                                  <td className="px-2 py-1">
                                    {e.period_start &&
                                      e.period_end &&
                                      `${new Date(
                                        e.period_start
                                      ).toLocaleDateString(
                                        "nl-NL"
                                      )} → ${new Date(
                                        e.period_end
                                      ).toLocaleDateString(
                                        "nl-NL"
                                      )}`}
                                  </td>
                                  <td className="px-2 py-1">
                                    {new Date(
                                      e.created_at
                                    ).toLocaleDateString(
                                      "nl-NL"
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              );
            })}
          </table>
        </div>
      </div>
    </div>
    
  );
}
