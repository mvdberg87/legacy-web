"use client";

import { useEffect, useState } from "react";

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
  subscription_start: string | null;
  subscription_end: string | null;
  has_paid_subscription: boolean;
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
  if (club.subscription_status === "blocked") return "blocked";
  if (club.subscription_status === "cancelled") return "cancelled";
  if (club.subscription_status === "expired") return "expired";

  // 👇 Upgrade toegekend maar nog niet betaald
  if (
    club.active_package !== "basic" &&
    !club.has_paid_subscription
  ) {
    return "pending_payment";
  }

  if (!club.has_paid_subscription) return "trial";

  return "active";
}

/* ===============================
   Page
   =============================== */

export default function AdminSubscriptionsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] =
    useState<SubscriptionStatus | "all">("all");

  const [openClubId, setOpenClubId] = useState<string | null>(null);
  const [events, setEvents] = useState<
    Record<string, SubscriptionEvent[]>
  >({});
  const [eventsLoading, setEventsLoading] = useState<string | null>(null);

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
    if (!confirm("Blokkade opheffen voor deze club?")) return;
    await fetch("/api/admin/subscriptions/unblock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clubId }),
    });
    load();
  }

  async function extendSubscription(clubId: string) {
    if (!confirm("Abonnement met 1 jaar verlengen?")) return;
    await fetch("/api/admin/subscriptions/extend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clubId }),
    });
    load();
  }

  async function cancelSubscription(clubId: string) {
    if (!confirm("Abonnement opzeggen?")) return;
    await fetch("/api/admin/subscriptions/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clubId }),
    });
    load();
  }

  async function adminOverrideActivate(clubId: string) {
    if (
      !confirm(
        "Abonnement activeren zonder betaling (admin override)?"
      )
    )
      return;

    await fetch("/api/admin/subscriptions/admin-override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clubId }),
    });

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">
            Abonnementen & proefperiodes
          </h1>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">
              Filter op status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as SubscriptionStatus | "all"
                )
              }
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">Alles</option>
              <option value="trial">Proefperiode</option>
              <option value="pending_payment">
                Wacht op betaling
              </option>
              <option value="active">Actief</option>
              <option value="blocked">Geblokkeerd</option>
              <option value="expired">Verlopen</option>
              <option value="cancelled">Opgezegd</option>
            </select>
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

                          {computedStatus ===
                            "pending_payment" && (
                            <div className="text-xs text-gray-500 mt-1">
                              Upgrade toegekend, betaling nog
                              niet voldaan
                            </div>
                          )}
                        </>
                      )}
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

                    <td className="px-3 py-3 text-center space-x-2">
                      {computedStatus === "blocked" ? (
                        <button
                          onClick={() => unblockClub(c.id)}
                          className="px-3 py-1 text-sm rounded bg-green-600 text-white"
                        >
                          🔓 Deblokkeren
                        </button>
                      ) : computedStatus ===
                        "pending_payment" ? (
                        <button
                          onClick={() =>
                            adminOverrideActivate(c.id)
                          }
                          className="px-3 py-1 text-sm rounded bg-orange-600 text-white"
                        >
                          ⚡ Activeer zonder betaling
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              extendSubscription(c.id)
                            }
                            className="px-3 py-1 text-sm rounded bg-blue-600 text-white"
                          >
                            🔁 Verlengen
                          </button>

                          <button
                            onClick={() =>
                              cancelSubscription(c.id)
                            }
                            className="px-3 py-1 text-sm rounded bg-red-600 text-white"
                          >
                            ⛔ Opzeggen
                          </button>
                        </>
                      )}
                    </td>
                  </tr>

                  {openClubId === c.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="p-4">
                        {eventsLoading === c.id ? (
                          <p className="text-sm">
                            Geschiedenis laden…
                          </p>
                        ) : (
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
