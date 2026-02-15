"use client";

import { useEffect, useState } from "react";
import getSupabaseBrowser from "@/lib/supabaseBrowser";

/* ===============================
   Types
   =============================== */

type Club = {
  id: string;
  name: string;
  email?: string | null;
};

type UpgradeRequest = {
  id: string;
  status: "pending" | "approved" | "rejected";
  requested_package: "basic" | "plus" | "pro" | "unlimited" | null;
  created_at: string;
  clubs: Club | Club[] | null;
};

/* ===============================
   Helpers
   =============================== */

function getClub(clubs: UpgradeRequest["clubs"]): Club | null {
  if (!clubs) return null;
  return Array.isArray(clubs) ? clubs[0] : clubs;
}

/* ===============================
   Page
   =============================== */

export default function AdminUpgradePage() {
  const supabase = getSupabaseBrowser();

  const [requests, setRequests] = useState<UpgradeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  /* ===============================
     Load upgrade requests
     =============================== */
  async function load() {
    setLoading(true);

    const { data, error } = await supabase
      .from("club_upgrade_requests")
      .select(`
        id,
        status,
        requested_package,
        created_at,
        clubs:club_id (
          id,
          name,
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Load upgrade requests error:", error);
      setRequests([]);
    } else {
      setRequests(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  /* ===============================
     Approve upgrade
     =============================== */
  async function approve(request: UpgradeRequest) {
    const club = getClub(request.clubs);

    if (!club || !request.requested_package) {
      alert("Club of pakket ontbreekt.");
      return;
    }

    const confirmed = window.confirm(
      `Weet je zeker dat je ${club.name} wilt upgraden naar "${request.requested_package}"?`
    );

    if (!confirmed) return;

    setActionId(request.id);

    try {
      const res = await fetch("/api/admin/approve-upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: request.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Goedkeuren mislukt");
      }
    } catch (err) {
      console.error("Approve upgrade error:", err);
      alert("Fout bij goedkeuren van upgrade.");
      setActionId(null);
      return;
    }

    await load();
    setActionId(null);
  }

  /* ===============================
     Reject upgrade
     =============================== */
  async function reject(request: UpgradeRequest) {
    const club = getClub(request.clubs);

    const reason = window.prompt(
      `Waarom wijs je de upgrade van ${club?.name ?? "deze club"} af? (optioneel)`
    );

    setActionId(request.id);

    try {
      await fetch("/api/admin/reject-upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: request.id,
          reason,
        }),
      });
    } catch {
      alert("Fout bij afwijzen van upgrade.");
    }

    await load();
    setActionId(null);
  }

  /* ===============================
     Render
     =============================== */

  return (
    <div className="space-y-8">
      <div className="bg-white text-black rounded-2xl shadow p-6">
        <h1 className="text-xl font-semibold mb-6">
          Upgrade aanvragen
        </h1>

        {loading ? (
          <p>Laden…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0d1b2a] text-white text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Club</th>
                  <th className="px-4 py-3 text-left">
                    Aangevraagd pakket
                  </th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>

              <tbody>
                {requests.map((r) => {
                  const club = getClub(r.clubs);

                  return (
                    <tr key={r.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 font-medium">
                        {club?.name ?? "Onbekende club"}
                      </td>

                      <td className="px-4 py-3 uppercase">
                        {r.requested_package ?? "-"}
                      </td>

                      <td className="px-4 py-3">
                        {r.status === "pending" && (
                          <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                        {r.status === "approved" && (
                          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                            Approved
                          </span>
                        )}
                        {r.status === "rejected" && (
                          <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                            Rejected
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {r.status === "pending" && (
                          <div className="flex gap-4">
                            <button
                              disabled={actionId === r.id}
                              onClick={() => approve(r)}
                              className="text-green-600 hover:underline disabled:opacity-50"
                            >
                              Goedkeuren
                            </button>

                            <button
                              disabled={actionId === r.id}
                              onClick={() => reject(r)}
                              className="text-red-600 hover:underline disabled:opacity-50"
                            >
                              Afwijzen
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {requests.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Geen upgrade aanvragen
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
