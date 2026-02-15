"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";


type Profile = { user_id: string; club_id: string; role: string };
type Club = { id: string; name: string | null; slug: string };
type Sponsor = {
  id: string;
  name: string;
  website: string | null;
  logo_url: string | null;
};

export default function AdminSponsorsPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [club, setClub] = useState<Club | null>(null);

  const [linkedSponsors, setLinkedSponsors] = useState<Sponsor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [newSponsor, setNewSponsor] = useState({
    name: "",
    website: "",
    logo_url: "",
  });
  const [submitting, setSubmitting] = useState(false);

  /* ---------- auth ---------- */

  useEffect(() => {
    let ignore = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!ignore) setUserId(data.user?.id ?? null);
    })();
    return () => {
      ignore = true;
    };
  }, [supabase]);

  /* ---------- profiel / club / sponsors ---------- */

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let ignore = false;

    (async () => {
      setLoading(true);
      setErr(null);

      try {
        const { data: prof, error: pErr } = await supabase
          .from("profiles")
          .select("user_id, club_id, role")
          .eq("user_id", userId)
          .maybeSingle();

        if (pErr) throw pErr;
        if (!prof)
          throw new Error(
            "Deze gebruiker is niet gekoppeld aan een club."
          );

        setProfile(prof as Profile);

        const { data: club, error: cErr } = await supabase
          .from("clubs")
          .select("id, slug, name")
          .eq("id", (prof as Profile).club_id)
          .maybeSingle();

        if (cErr) throw cErr;
        setClub(club as Club);

        const { data: rows, error: sErr } = await supabase
          .from("club_sponsors")
          .select(
            `sponsor:sponsors ( id, name, website, logo_url )`
          )
          .eq("club_id", (prof as Profile).club_id);

        if (sErr) throw sErr;

        setLinkedSponsors(
          (rows ?? [])
            .map((r: any) => r.sponsor as Sponsor)
            .filter(Boolean)
        );
      } catch (e: any) {
        setErr(e?.message ?? "Onbekende fout.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [supabase, userId]);

  /* ---------- zoeken ---------- */

  async function searchSponsors() {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setErr(null);
    const q = `%${searchTerm.trim()}%`;

    const { data, error } = await supabase
      .from("sponsors")
      .select("id, name, website, logo_url")
      .ilike("name", q)
      .limit(20);

    if (error) {
      setErr(error.message);
      return;
    }

    const linkedIds = new Set(linkedSponsors.map((s) => s.id));
    setSearchResults(
      (data ?? []).filter((s) => !linkedIds.has(s.id))
    );
  }

  /* ---------- create / link / unlink ---------- */

  async function createSponsor(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setSubmitting(true);
    setErr(null);

    try {
      const { data: sponsor, error: sErr } = await supabase
        .from("sponsors")
        .insert({
          name: newSponsor.name.trim(),
          website: newSponsor.website.trim() || null,
          logo_url: newSponsor.logo_url.trim() || null,
        })
        .select("*")
        .single();

      if (sErr) throw sErr;

      const { error: linkErr } = await supabase
        .from("club_sponsors")
        .insert({
          club_id: profile.club_id,
          sponsor_id: (sponsor as Sponsor).id,
        });

      if (linkErr) throw linkErr;

      setLinkedSponsors((prev) => [
        sponsor as Sponsor,
        ...prev,
      ]);
      setNewSponsor({ name: "", website: "", logo_url: "" });
    } catch (e: any) {
      setErr(e?.message ?? "Kon sponsor niet toevoegen.");
    } finally {
      setSubmitting(false);
    }
  }

  async function linkSponsor(s: Sponsor) {
    if (!profile) return;

    const { error } = await supabase
      .from("club_sponsors")
      .insert({ club_id: profile.club_id, sponsor_id: s.id });

    if (error) {
      setErr(error.message);
      return;
    }

    setLinkedSponsors((prev) => [s, ...prev]);
    setSearchResults((res) => res.filter((x) => x.id !== s.id));
  }

  async function unlinkSponsor(s: Sponsor) {
    if (!profile) return;

    const { error } = await supabase
      .from("club_sponsors")
      .delete()
      .eq("club_id", profile.club_id)
      .eq("sponsor_id", s.id);

    if (error) {
      setErr(error.message);
      return;
    }

    setLinkedSponsors((prev) =>
      prev.filter((x) => x.id !== s.id)
    );
  }

  /* ---------- Render ---------- */

  return (
    <div className="space-y-8">
      <div className="bg-white text-black rounded-2xl shadow p-6">
        <h1 className="text-xl font-semibold">
          Sponsors
        </h1>
        <p className="text-sm text-gray-500">
          {club
            ? `Beheer sponsors voor ${club.name ?? club.slug}`
            : "Sponsorbeheer"}
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow p-6">
          <p>Laden…</p>
        </div>
      ) : err && !club ? (
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-red-600">{err}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Gekoppelde sponsors */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-semibold mb-4">
              Gekoppelde sponsors
            </h2>

            {linkedSponsors.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nog geen sponsors gekoppeld.
              </p>
            ) : (
              <ul className="space-y-2">
                {linkedSponsors.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between border rounded-xl px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {s.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {s.website || "—"}
                      </div>
                    </div>
                    <button
                      onClick={() => unlinkSponsor(s)}
                      className="text-sm border rounded-lg px-2 py-1"
                    >
                      Ontkoppel
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {err && (
              <p className="text-red-600 text-sm mt-3">
                {err}
              </p>
            )}
          </div>

          {/* Sponsor toevoegen */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-semibold mb-4">
              Sponsor toevoegen
            </h2>

            <form
              onSubmit={createSponsor}
              className="space-y-4 mb-6"
            >
              <div>
                <label className="text-sm block mb-1">
                  Naam *
                </label>
                <input
                  required
                  value={newSponsor.name}
                  onChange={(e) =>
                    setNewSponsor((s) => ({
                      ...s,
                      name: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm block mb-1">
                    Website
                  </label>
                  <input
                    value={newSponsor.website}
                    onChange={(e) =>
                      setNewSponsor((s) => ({
                        ...s,
                        website: e.target.value,
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">
                    Logo URL
                  </label>
                  <input
                    value={newSponsor.logo_url}
                    onChange={(e) =>
                      setNewSponsor((s) => ({
                        ...s,
                        logo_url: e.target.value,
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <button
                disabled={submitting}
                className="bg-[#0d1b2a] text-white rounded-lg px-4 py-2 text-sm disabled:opacity-50"
              >
                {submitting
                  ? "Opslaan…"
                  : "Sponsor opslaan en koppelen"}
              </button>
            </form>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">
                Bestaande sponsor koppelen
              </h3>
              <div className="flex gap-2">
                <input
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Zoek op naam"
                  className="flex-1 border rounded-lg px-3 py-2"
                />
                <button
                  onClick={searchSponsors}
                  className="border rounded-lg px-3 py-2"
                >
                  Zoek
                </button>
              </div>

              {searchResults.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {searchResults.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between border rounded-xl px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="font-medium truncate">
                          {s.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {s.website || "—"}
                        </div>
                      </div>
                      <button
                        onClick={() => linkSponsor(s)}
                        className="text-sm border rounded-lg px-2 py-1"
                      >
                        Koppel
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
