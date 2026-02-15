"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import getSupabaseBrowser from "@/lib/supabaseBrowser";

type ClubRequest = {
  id: string;
  club_name: string;
  slug: string;
  contact_email: string;
  note?: string | null;
  status: string;
  token?: string | null;
  created_at: string;
};

export default function AdminRequestsPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const params = useSearchParams();
  const focusId = params.get("id");

  const [requests, setRequests] = useState<ClubRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  async function loadRequests() {
    setLoading(true);
    const { data, error } = await supabase
      .from("club_signup_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Fout bij ophalen requests:", error);
    setRequests(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function approveRequest(req: ClubRequest) {
    if (
      !confirm(
        `Wil je ${req.club_name} goedkeuren en een activatiemail versturen?`
      )
    )
      return;

    try {
      setRefreshing(true);
      const token = crypto.randomUUID();

      const { error: updateErr } = await supabase
        .from("club_signup_requests")
        .update({ status: "approved", token })
        .eq("id", req.id);

      if (updateErr) throw updateErr;

      const res = await fetch("/api/send-activation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: req.contact_email,
          clubName: req.club_name,
          token,
        }),
      });

      if (!res.ok) {
        alert(
          "Aanvraag goedgekeurd, maar de activatiemail kon niet worden verstuurd."
        );
      } else {
        alert(
          `Aanvraag goedgekeurd. Activatiemail verzonden naar ${req.contact_email}.`
        );
      }

      await loadRequests();
    } catch (err: any) {
      alert(err.message || "Er ging iets mis bij het goedkeuren.");
    } finally {
      setRefreshing(false);
    }
  }

  async function rejectRequest(req: ClubRequest) {
    if (
      !confirm(
        `Weet je zeker dat je de aanvraag van ${req.club_name} wilt weigeren?`
      )
    )
      return;

    try {
      setRefreshing(true);
      const { error } = await supabase
        .from("club_signup_requests")
        .update({ status: "rejected" })
        .eq("id", req.id);
      if (error) throw error;
      await loadRequests();
    } catch (err: any) {
      alert(err.message || "Er ging iets mis bij het weigeren.");
    } finally {
      setRefreshing(false);
    }
  }

  function statusColor(status: string) {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  }

  const filteredRequests = requests
    .filter((r) => {
      const matchSearch =
        r.club_name.toLowerCase().includes(search.toLowerCase()) ||
        r.contact_email.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all" ? true : r.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
        );
      } else {
        return a.club_name.localeCompare(b.club_name);
      }
    });

  /* ---------- Render ---------- */

  return (
    <div className="space-y-8">
      <div className="bg-white text-black rounded-2xl shadow p-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold">
              Clubaanvragen
            </h1>
            <p className="text-sm text-gray-500">
              Beheer nieuwe clubaanvragen en activaties.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Zoeken op club of e-mail"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-52"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Alle statussen</option>
              <option value="pending">In behandeling</option>
              <option value="approved">Goedgekeurd</option>
              <option value="rejected">Geweigerd</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="newest">Nieuwste eerst</option>
              <option value="oldest">Oudste eerst</option>
              <option value="alphabetical">
                Alfabetisch
              </option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p>Laden…</p>
        ) : filteredRequests.length === 0 ? (
          <p className="text-gray-500 italic">
            Geen aanvragen gevonden.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#0d1b2a] text-white text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Club</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">
                    Aangemaakt
                  </th>
                  <th className="px-4 py-3">Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req, i) => (
                  <motion.tr
                    key={req.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={`border-b last:border-b-0 ${
                      req.id === focusId
                        ? "bg-yellow-50"
                        : "hover:bg-blue-50/40"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">
                      {req.club_name}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${req.contact_email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {req.contact_email}
                      </a>
                      {req.note && (
                        <p className="text-xs text-gray-500 mt-1">
                          {req.note}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {req.slug || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(
                        req.created_at
                      ).toLocaleDateString("nl-NL")}
                    </td>
                    <td className="px-4 py-3">
                      {req.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              approveRequest(req)
                            }
                            disabled={refreshing}
                            className="bg-green-600 text-white px-3 py-1 rounded-md text-xs"
                          >
                            Goedkeuren
                          </button>
                          <button
                            onClick={() =>
                              rejectRequest(req)
                            }
                            disabled={refreshing}
                            className="bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                          >
                            Weigeren
                          </button>
                        </div>
                      ) : req.status === "approved" &&
                        req.token ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-gray-600">
                            Goedgekeurd
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${window.location.origin}/onboarding/claim?token=${req.token}`
                              );
                              alert(
                                "Activatielink gekopieerd."
                              );
                            }}
                            className="text-blue-600 text-xs underline"
                          >
                            Kopieer activatielink
                          </button>
                        </div>
                      ) : req.status === "rejected" ? (
                        <span className="text-gray-400 text-xs italic">
                          Geweigerd
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">
                          Geen actie nodig
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
