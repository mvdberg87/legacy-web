"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";


type Profile = {
  user_id: string;
  email: string;
  club_name?: string | null;
  role?: string | null;
  created_at?: string;
  last_login?: string | null;
};

export default function AdminProfilesPanel() {
  const supabase = getSupabaseBrowser();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  /* ---------- Profielen laden ---------- */
  async function loadProfiles() {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles_overview")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("❌ Fout bij ophalen profielen:", error);
    setProfiles(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadProfiles();
  }, []);

  /* ---------- Gebruiker goedkeuren ---------- */
  async function approveUser(profile: Profile) {
    if (!confirm(`Wil je ${profile.email} goedkeuren en koppelen aan een club?`)) return;
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/approve-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profile.user_id,
          email: profile.email,
          clubName: profile.club_name || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Er ging iets mis.");
      alert(data.message);
      await loadProfiles();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRefreshing(false);
    }
  }

  /* ---------- Gebruiker afwijzen ---------- */
  async function rejectUser(profile: Profile) {
    if (!confirm(`Weet je zeker dat je ${profile.email} wilt afwijzen?`)) return;
    try {
      setRefreshing(true);
      const { error } = await supabase
        .from("profiles")
        .update({ role: "rejected" })
        .eq("user_id", profile.user_id);
      if (error) throw error;
      alert(`${profile.email} is afgewezen.`);
      await loadProfiles();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRefreshing(false);
    }
  }

  /* ---------- Gebruiker verwijderen ---------- */
  async function deleteUser(profile: Profile) {
    if (!confirm(`⚠️ Weet je zeker dat je ${profile.email} volledig wilt verwijderen?`)) return;
    try {
      setRefreshing(true);
      const { error } = await supabase.from("profiles").delete().eq("user_id", profile.user_id);
      if (error) throw error;
      alert(`🗑️ ${profile.email} is verwijderd.`);
      await loadProfiles();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRefreshing(false);
    }
  }

  /* ---------- Filtering ---------- */
  const filteredProfiles = profiles.filter(
    (p) =>
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      (p.club_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.role ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="bg-white border rounded-2xl p-6 shadow mt-10"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="font-semibold text-[#0d1b2a] text-lg mb-4">👥 Gebruikers & Clubs</h2>
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="🔍 Zoek op e-mail, club of rol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-72"
        />
      </div>

      {loading ? (
        <p>Laden...</p>
      ) : filteredProfiles.length === 0 ? (
        <p className="text-gray-500 italic">Geen profielen gevonden.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded-xl overflow-hidden">
            <thead className="bg-[#0d1b2a] text-white text-xs uppercase">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Email</th>
                <th className="px-3 py-2 text-left font-medium">Club</th>
                <th className="px-3 py-2 text-center font-medium">Status</th>
                <th className="px-3 py-2 text-center font-medium">Rol</th>
                <th className="px-3 py-2 text-center font-medium">Laatste login</th>
                <th className="px-3 py-2 text-center font-medium">Acties</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map((p, i) => (
                <motion.tr
                  key={p.user_id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b hover:bg-blue-50/40 transition"
                >
                  <td className="px-3 py-2">{p.email}</td>
                  <td className="px-3 py-2">{p.club_name || <em className="text-gray-400">-</em>}</td>
                  <td className="px-3 py-2 text-center capitalize">
                    {p.role === "rejected" ? (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                        Afgewezen
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Actief
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">{p.role || "-"}</td>
                  <td className="px-3 py-2 text-center">
                    {p.last_login
                      ? new Date(p.last_login).toLocaleDateString("nl-NL")
                      : "-"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => approveUser(p)}
                        disabled={refreshing}
                        className="bg-green-600 text-white px-2 py-1 rounded-md text-xs hover:bg-green-700"
                      >
                        ✅
                      </button>
                      <button
                        onClick={() => rejectUser(p)}
                        disabled={refreshing}
                        className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs hover:bg-yellow-600"
                      >
                        ❌
                      </button>
                      <button
                        onClick={() => deleteUser(p)}
                        disabled={refreshing}
                        className="bg-red-600 text-white px-2 py-1 rounded-md text-xs hover:bg-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
