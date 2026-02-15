"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import getSupabaseBrowser from "@/lib/supabaseBrowser";

/* ===============================
   Types
   =============================== */

type ClubOverviewRow = {
  id: string;
  name: string;
  status: "pending" | "approved" | "rejected" | "archived";
  ad_package: "basic" | "plus" | "pro" | "unlimited";
  active_jobs: number | null;
  total_sponsors: number | null;
  total_clicks: number | null;
  last_activity_at: string | null;
  admin_override?: boolean;
};

type SignupRequest = {
  id: string;
  club_name: string;
  email: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
};

/* ===============================
   Club signup requests panel
   =============================== */

function ClubSignupRequestsPanel() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [requests, setRequests] = useState<SignupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);

    const { data, error } = await supabase
      .from("club_signup_requests")
      .select("id, club_name, email, created_at, status")
      .eq("status", "pending")
      .is("club_id", null)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Load signup requests error:", error);
      setRequests([]);
    } else {
      setRequests(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(requestId: string) {
    if (approvingId) return;
    if (!confirm("Weet je zeker dat je deze club wilt goedkeuren?")) return;

    setApprovingId(requestId);

    try {
      const res = await fetch("/api/admin/approve-club", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      if (!res.ok) {
        alert("Goedkeuren mislukt");
        return;
      }

      await load();
    } finally {
      setApprovingId(null);
    }
  }

  if (loading) return <p>Laden…</p>;
  if (requests.length === 0)
    return (
      <div className="bg-white text-black rounded-2xl shadow p-6">
        <p>Geen nieuwe aanvragen</p>
      </div>
    );

  return (
    <motion.div
      className="bg-white text-black rounded-2xl shadow p-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="font-semibold text-lg mb-4">
        Nieuwe clubaanvragen
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#0d1b2a] text-white text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left">Club</th>
              <th className="px-3 py-2 text-left">E-mail</th>
              <th className="px-3 py-2 text-center">
                Aangevraagd
              </th>
              <th className="px-3 py-2 text-center">Actie</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b last:border-b-0">
                <td className="px-3 py-2 font-medium">
                  {r.club_name}
                </td>
                <td className="px-3 py-2">{r.email}</td>
                <td className="px-3 py-2 text-center text-xs">
                  {new Date(
                    r.created_at
                  ).toLocaleDateString("nl-NL")}
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => approve(r.id)}
                    disabled={approvingId === r.id}
                    className={`px-3 py-1 rounded text-xs text-white ${
                      approvingId === r.id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {approvingId === r.id
                      ? "Bezig…"
                      : "Goedkeuren"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ===============================
   Clubs overview panel
   =============================== */

function ClubOverviewPanel() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [clubs, setClubs] = useState<ClubOverviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  async function loadClubs() {
    setLoading(true);

    let query = supabase
      .from("club_admin_overview")
      .select("*")
      .order("created_at", { ascending: false });

    if (!showArchived) {
      query = query.neq("status", "archived");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Load clubs error:", error);
      setClubs([]);
    } else {
      setClubs(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadClubs();
  }, [showArchived]);

  if (loading) return <p>Laden…</p>;

  return (
    <motion.div
      className="bg-white text-black rounded-2xl shadow p-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* tabelinhoud ongewijzigd */}
    </motion.div>
  );
}

/* ===============================
   Admin dashboard page
   =============================== */

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <ClubSignupRequestsPanel />
      <ClubOverviewPanel />
    </div>
  );
}
