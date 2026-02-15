"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import Link from "next/link";

/* ---------- Types ---------- */

type Profile = {
  user_id: string;
  email: string;
  role: string;
  created_at: string;

  club_id: string | null;
  club_name: string | null;
  club_slug: string | null;
  club_status: string | null;

  signup_request_id: string | null;
  signup_request_status: "pending" | "approved" | "rejected" | null;
};


/* ---------- Pagina ---------- */

export default function AdminProfilesPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  /* ---------- Data ophalen ---------- */

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    setLoading(true);

    const { data, error } = await supabase
      .from("admin_profiles_overview")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fout bij laden profielen:", error);
      setProfiles([]);
    } else {
      setProfiles(data ?? []);
    }

    setLoading(false);
  }

  /* ---------- Acties ---------- */

  async function updateClubStatus(
    clubId: string,
    status: "approved" | "rejected"
  ) {
    if (!confirm(`Club ${status === "approved" ? "goedkeuren" : "afwijzen"}?`))
      return;

    try {
      setRefreshing(true);

      const { error } = await supabase
        .from("clubs")
        .update({ status })
        .eq("id", clubId);

      if (error) throw error;

      await loadProfiles();
    } catch {
      alert("Fout bij aanpassen status");
    } finally {
      setRefreshing(false);
    }
  }

  async function deleteClub(clubId: string, clubName: string) {
    if (
      !confirm(
        `Weet je zeker dat je ${clubName} wilt verwijderen?\nDit verwijdert ook vacatures en statistieken.`
      )
    )
      return;

    try {
      setRefreshing(true);

      const res = await fetch("/api/admin/delete-club", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId }),
      });

      if (!res.ok) throw new Error("Delete failed");

      await loadProfiles();
    } catch {
      alert("Fout bij verwijderen club");
    } finally {
      setRefreshing(false);
    }
  }

async function resendActivationLink(requestId: string) {
  if (!confirm("Nieuwe activatielink versturen?")) return;

  try {
    setRefreshing(true);

    const res = await fetch("/api/admin/resend-activation-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId }),
    });

    if (!res.ok) throw new Error();

    alert("Activatielink opnieuw verstuurd.");
  } catch {
    alert("Fout bij versturen activatielink.");
  } finally {
    setRefreshing(false);
  }
}

  /* ---------- Filter ---------- */

  const filtered = profiles.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.email.toLowerCase().includes(q) ||
      (p.club_name ?? "").toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q)
    );
  });

  /* ---------- Render ---------- */

  return (
    <div className="space-y-8">
      <div className="bg-white text-black rounded-2xl shadow p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">
            Profielbeheer
          </h1>

          <input
            type="text"
            placeholder="Zoek op e-mail, club of rol"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-72"
          />
        </div>

        {/* Content */}
        {loading ? (
          <p>Laden…</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 italic">
            Geen profielen gevonden.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#0d1b2a] text-white text-xs uppercase">
                <tr>
                  <th className="px-3 py-3 text-left">E-mail</th>
                  <th className="px-3 py-3 text-left">Club</th>
                  <th className="px-3 py-3 text-left">Rol</th>
                  <th className="px-3 py-3 text-left">Aangemaakt</th>
                  <th className="px-3 py-3 text-center">Acties</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((p, i) => {
                  const club = p.club_id
                    ? {
                        id: p.club_id,
                        name: p.club_name!,
                        slug: p.club_slug!,
                        status: p.club_status!,
                      }
                    : null;

                  return (
                    <motion.tr
                      key={p.user_id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b last:border-b-0 hover:bg-blue-50/40"
                    >
                      <td className="px-3 py-3">
                        {p.email}
                      </td>

                      <td className="px-3 py-3">
                        {club ? (
                          <div className="flex flex-col">
                            <Link
  href={`/admin/clubs/${club.slug}`}
  className="text-blue-600 hover:underline"
>

  {club.name}
</Link>
                            <span className="text-xs text-gray-500">
                              {club.status}
                            </span>
                          </div>
                        ) : (
                          <span className="italic text-gray-400">
                            Geen club
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-3">
                        {p.role}
                      </td>

                      <td className="px-3 py-3">
                        {new Date(p.created_at).toLocaleDateString("nl-NL")}
                      </td>

                      <td className="px-3 py-3 text-center">
                        {club && (
                          <div className="flex justify-center gap-2">
  <button
    onClick={() =>
      updateClubStatus(club.id, "approved")
    }
    disabled={refreshing}
    className="bg-green-600 text-white px-2 py-1 rounded text-xs"
  >
    ✅
  </button>

  <button
    onClick={() =>
      updateClubStatus(club.id, "rejected")
    }
    disabled={refreshing}
    className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
  >
    ❌
  </button>

  {club &&
  p.signup_request_id &&
  p.signup_request_status === "approved" &&
  club.status !== "active" && (
    <button
      onClick={() => resendActivationLink(p.signup_request_id)}
      disabled={refreshing}
      className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
      title="Nieuwe activatielink sturen"
    >
      🔁
    </button>
)}

  <button
    onClick={() =>
      deleteClub(club.id, club.name)
    }
    disabled={refreshing}
    className="bg-red-600 text-white px-2 py-1 rounded text-xs"
  >
    🗑️
  </button>
</div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
