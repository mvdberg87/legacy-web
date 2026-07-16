"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import LoadingCard from "@/components/ui/LoadingCard";
import EmptyState from "@/components/ui/EmptyState";
import ErrorCard from "@/components/ui/ErrorCard";
import { toast } from "sonner";
import { useConfirm } from "@/components/providers/confirm-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  X,
  Trash2,
} from "lucide-react";


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
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const { confirm } = useConfirm();

  /* ---------- Profielen laden ---------- */
  async function loadProfiles() {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles_overview")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
  setError(error.message);
  setLoading(false);
  return;
}
    setProfiles(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadProfiles();
  }, []);

  /* ---------- Gebruiker goedkeuren ---------- */
  async function approveUser(profile: Profile) {
    const confirmed = await confirm({
  title: "Gebruiker goedkeuren",
  description: `Wil je ${profile.email} goedkeuren en koppelen aan een club?`,
  confirmText: "Goedkeuren",
  cancelText: "Annuleren",
});

if (!confirmed) return;
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
      toast.success(data.message);
      await loadProfiles();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setRefreshing(false);
    }
  }

  /* ---------- Gebruiker afwijzen ---------- */
  async function rejectUser(profile: Profile) {
    const confirmed = await confirm({
  title: "Gebruiker afwijzen",
  description: `Weet je zeker dat je ${profile.email} wilt afwijzen?`,
  confirmText: "Afwijzen",
  cancelText: "Annuleren",
  destructive: true,
});

if (!confirmed) return;
    try {
      setRefreshing(true);
      const { error } = await supabase
        .from("profiles")
        .update({ role: "rejected" })
        .eq("user_id", profile.user_id);
      if (error) throw error;
      toast.success(`${profile.email} is afgewezen.`);
      await loadProfiles();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setRefreshing(false);
    }
  }

  /* ---------- Gebruiker verwijderen ---------- */
  async function deleteUser(profile: Profile) {
    const confirmed = await confirm({
  title: "Gebruiker verwijderen",
  description: `Weet je zeker dat je ${profile.email} volledig wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`,
  confirmText: "Verwijderen",
  cancelText: "Annuleren",
  destructive: true,
});

if (!confirmed) return;
    try {
      setRefreshing(true);
      const { error } = await supabase.from("profiles").delete().eq("user_id", profile.user_id);
      if (error) throw error;
      toast.success(`${profile.email} is verwijderd.`);
      await loadProfiles();
    } catch (err: any) {
      toast.error(err.message);
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

  if (error) {

  return (

    <ErrorCard
      message={error}
    />

  );

}

  return (
    <motion.div
      className="bg-white border rounded-2xl p-6 shadow mt-10"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="font-semibold text-[#0d1b2a] text-lg mb-4">👥 Gebruikers & Clubs</h2>
      <div className="flex justify-end mb-4">
        <Input
  placeholder="🔍 Zoek op e-mail, club of rol..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full md:w-72"
/>
      </div>

      {loading ? (
        <LoadingCard rows={6} />
      ) : filteredProfiles.length === 0 ? (
        <EmptyState
  title="Geen profielen gevonden"
  description="Er zijn momenteel geen gebruikers die aan deze zoekopdracht voldoen."
/>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[800px] text-sm border rounded-xl overflow-hidden">
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
                  <td className="px-3 py-2 break-all max-w-[220px]">
  {p.email}
</td>
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
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button size="icon">
  <Check className="h-4 w-4" />
</Button>

<Button size="icon" variant="secondary">
  <X className="h-4 w-4" />
</Button>

<Button size="icon" variant="destructive">
  <Trash2 className="h-4 w-4" />
</Button>
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
