"use client";

import ClubNavbar from "@/components/club/ClubNavbar";
import ClubSupportBar from "@/components/ClubSupportBar";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";
import StatusBadge from "@/components/talentpool/StatusBadge";

type Talent = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  preferences: string[];
  education: string;
  study: string;
  city: string;
  status: string;
  created_at: string;
};

export default function ClubTalentPage() {
  const { slug } = useParams<{ slug: string }>();

  const supabase = useMemo(() => getSupabaseBrowser(), []);

const [talents, setTalents] = useState<Talent[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadTalents();
}, []);

async function loadTalents() {
  try {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("club_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile?.club_id) return;

    const { data, error } = await supabase
      .from("talentpool_profiles")
      .select(`
  id,
  first_name,
  last_name,
  email,
  preferences,
  education,
  study,
  city,
  status,
  created_at
`)
      .eq("club_id", profile.club_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setTalents((data ?? []) as Talent[]);
  } finally {
    setLoading(false);
  }
}

async function deleteTalent(id: string) {
  const confirmed = window.confirm(
    "Weet je zeker dat je deze kandidaat wilt verwijderen?"
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("talentpool_profiles")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Er is iets misgegaan bij het verwijderen.");
    console.error(error);
    return;
  }

  setTalents((current) =>
    current.filter((talent) => talent.id !== id)
  );
}

const totalTalents = talents.length;

const stageCount = talents.filter((t) =>
  t.preferences.includes("Stage")
).length;

const bijbaanCount = talents.filter((t) =>
  t.preferences.includes("Bijbaan")
).length;

const starterCount = talents.filter((t) =>
  t.preferences.includes("Starter")
).length;

if (loading) {
  return <p className="p-6">Laden...</p>;
}

  return (
    <main className="min-h-screen p-6 bg-[#0d1b2a]">
      <ClubNavbar slug={slug} />

      <div className="max-w-5xl mx-auto bg-white border-2 rounded-2xl p-6 shadow mt-6">

        <h1 className="text-2xl font-semibold mb-2">
          Talentpool
        </h1>

        <p className="text-gray-600 mb-8">
          Bekijk en beheer alle aanmeldingen voor de Talentpool van jouw vereniging.
        </p>

        {/* KPI's */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <div className="rounded-xl border p-6">
            <p className="text-sm text-gray-500">Talenten</p>
            <p className="mt-2 text-3xl font-bold">{totalTalents}</p>
          </div>

          <div className="rounded-xl border p-6">
            <p className="text-sm text-gray-500">Stages</p>
            <p className="mt-2 text-3xl font-bold">{stageCount}</p>
          </div>

          <div className="rounded-xl border p-6">
            <p className="text-sm text-gray-500">Bijbanen</p>
            <p className="mt-2 text-3xl font-bold">{bijbaanCount}</p>
          </div>

          <div className="rounded-xl border p-6">
            <p className="text-sm text-gray-500">Starters</p>
            <p className="mt-2 text-3xl font-bold">{starterCount}</p>
          </div>

        </div>

        {/* Mobiele weergave */}
<div className="md:hidden space-y-4 mb-6">
  {talents.map((talent) => (
    <div
      key={talent.id}
      className="rounded-xl border border-[#0d1b2a] p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-lg">
            {talent.first_name} {talent.last_name}
          </h3>

          <p className="text-sm text-gray-500 break-all">
            {talent.email}
          </p>
        </div>

        <StatusBadge status={talent.status} />
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <p>
          <span className="font-medium">Zoekt:</span>{" "}
          {talent.preferences.join(", ")}
        </p>

        <p>
          <span className="font-medium">Opleiding:</span>{" "}
          {talent.education} {talent.study}
        </p>

        <p>
          <span className="font-medium">Plaats:</span>{" "}
          {talent.city}
        </p>

        <p>
          <span className="font-medium">Ingeschreven:</span>{" "}
          {new Date(talent.created_at).toLocaleDateString("nl-NL")}
        </p>
      </div>

      <div className="mt-5 flex gap-3">
        <Link
          href={`/club/${slug}/talent/${talent.id}`}
          className="flex-1 rounded-xl border border-[#0d1b2a] px-4 py-2 text-center font-medium hover:bg-gray-100 transition"
        >
          <span className="inline-flex items-center gap-2 justify-center">
            <Eye size={18} />
            Bekijken
          </span>
        </Link>

        <button
          onClick={() => deleteTalent(talent.id)}
          className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  ))}
</div>

        {/* Tabel */}
        <div className="hidden md:block overflow-x-auto">
  <div className="border-4 border-[#0d1b2a] rounded-xl min-w-max">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-[#0d1b2a] text-white border-b-4 border-[#0d1b2a]">
              <tr>
                <th className="px-4 py-3 text-left">Naam</th>
                <th className="px-4 py-3 text-center">
  Status
</th>
                <th className="px-4 py-3 text-center">Zoekt</th>
                <th className="px-4 py-3 text-center">Opleiding</th>
                <th className="px-4 py-3 text-center">Plaats</th>
                <th className="px-4 py-3 text-center">Ingeschreven</th>
                <th className="px-4 py-3 text-center">Beheer</th>
              </tr>
            </thead>

              <tbody>
  {talents.map((talent) => (
    <tr
      key={talent.id}
      className="border-t border-[#0d1b2a] hover:bg-gray-100"
    >
      <td className="px-4 py-3">
        <div className="font-medium">
          {talent.first_name} {talent.last_name}
        </div>

        <div className="text-xs text-gray-500">
          {talent.email}
        </div>
      </td>

      <td className="px-4 py-3">
  <StatusBadge status={talent.status} />
</td>

      <td className="px-4 py-3 text-center">
        {talent.preferences.join(", ")}
      </td>

      <td className="px-4 py-3 text-center">
        {talent.education} {talent.study}
      </td>

      <td className="px-4 py-3 text-center">
        {talent.city}
      </td>

      <td className="px-4 py-3 text-center">
        {new Date(talent.created_at).toLocaleDateString("nl-NL")}
      </td>

      <td className="px-4 py-3">
  <div className="flex items-center justify-center gap-2">

    <Link
      href={`/club/${slug}/talent/${talent.id}`}
      className="flex h-9 w-9 items-center justify-center rounded-md border hover:bg-gray-100 transition"
      title="Bekijken"
    >
      <Eye size={18} />
    </Link>

    <button
      onClick={() => deleteTalent(talent.id)}
      className="flex h-9 w-9 items-center justify-center rounded-md bg-red-600 text-white hover:bg-red-700 transition"
      title="Verwijderen"
    >
      <Trash2 size={18} />
    </button>

  </div>
</td>
    </tr>
  ))}
</tbody>

          </table>
</div>
</div>

      </div>

      <ClubSupportBar />
    </main>
  );
}