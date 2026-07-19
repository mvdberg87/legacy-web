"use client";

import ClubNavbar from "@/components/club/ClubNavbar";
import ClubSupportBar from "@/components/ClubSupportBar";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import Link from "next/link";
import StatusBadge from "@/components/talentpool/StatusBadge";

type Talent = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  preferences: string[];
  education: string;
  study: string;
  field: string | null;
  city: string;
  distance: number | null;
  available_from: string | null;
  notes: string | null;

  status: string;
  internal_notes: string | null;

  created_at: string;
};

export default function TalentDetailPage() {
  const { slug, id } = useParams<{
    slug: string;
    id: string;
  }>();

  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [talent, setTalent] = useState<Talent | null>(null);
  const [status, setStatus] = useState("Nieuw");
const [internalNotes, setInternalNotes] = useState("");
const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasChanges =
  status !== talent?.status ||
  internalNotes !== (talent?.internal_notes ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadTalent();
  }, []);

  async function loadTalent() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("talentpool_profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      const profile = data as Talent;

setTalent(profile);
setStatus(profile.status ?? "Nieuw");
setInternalNotes(profile.internal_notes ?? "");
    } finally {
      setLoading(false);
    }
  }

  async function saveChanges() {
  if (!talent) return;

  try {
    setSaving(true);

    const { error } = await supabase
      .from("talentpool_profiles")
      .update({
        status,
        internal_notes: internalNotes,
      })
      .eq("id", talent.id);

    if (error) {
      console.error(error);
      alert("Opslaan mislukt.");
      return;
    }

    setSaved(true);

setTimeout(() => {
  setSaved(false);
}, 3000);

    setTalent({
      ...talent,
      status,
      internal_notes: internalNotes,
    });

  } finally {
    setSaving(false);
  }
}

  if (loading) {
    return (
      <main className="min-h-screen p-6 bg-[#0d1b2a]">
        <ClubNavbar slug={slug} />
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 mt-6">
          Laden...
        </div>
        <ClubSupportBar />
      </main>
    );
  }

  if (!talent) {
    return (
      <main className="min-h-screen p-6 bg-[#0d1b2a]">
        <ClubNavbar slug={slug} />
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 mt-6">
          Talent niet gevonden.
        </div>
        <ClubSupportBar />
      </main>
    );
  }

  return (
  <main className="min-h-screen bg-[#0d1b2a] p-6">
    <ClubNavbar slug={slug} />

    <div className="max-w-5xl mx-auto mt-6 space-y-6">

      {/* Header */}
      <div className="bg-white rounded-2xl shadow border-2 p-8">

        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">

          <div>

            <div className="flex-1">

  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">

    <div>
      <h1 className="text-3xl font-bold text-[#0d1b2a]">
        {talent.first_name} {talent.last_name}
      </h1>

      <p className="mt-2 text-gray-500">
        Ingeschreven op{" "}
        {new Date(talent.created_at).toLocaleDateString("nl-NL")}
      </p>
    </div>

    <StatusBadge status={status} />

</div>

            <div className="flex flex-wrap gap-2 mt-5">

              {talent.preferences.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full bg-[#0d1b2a] text-white text-sm"
                >
                  {item}
                </span>
              ))}

            </div>

          </div>

          </div>

          <div className="text-right">

            <div className="text-sm text-gray-500">
              Opleidingsniveau
            </div>

            <div className="text-xl font-semibold">
              {talent.education || "-"}
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Vakgebied
            </div>

            <div className="font-medium">
              {talent.field || "-"}
            </div>

          </div>

        </div>

      </div>

      <div className="bg-white rounded-2xl shadow border-2 p-6">

  <h2 className="text-lg font-semibold">
  Status kandidaat
</h2>

<div className="mt-4 mb-6">
  <StatusBadge status={status} />
</div>

<label className="block text-sm font-medium mb-2">
  Status wijzigen
</label>

  <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className="w-full rounded-xl border p-3"
  >
    <option>Nieuw</option>
    <option>In behandeling</option>
    <option>Voorgesteld aan sponsor</option>
    <option>Gesprek gepland</option>
    <option>Geplaatst</option>
    <option>Afgewezen</option>
  </select>

</div>

      {/* Gegevens */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl shadow border-2 p-6">

          <h2 className="text-lg font-semibold mb-5">
            Contactgegevens
          </h2>

          <div className="space-y-5">

            <div>
              <p className="text-sm text-gray-500">E-mailadres</p>
              <p className="font-medium break-all">
                {talent.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Telefoonnummer</p>
              <p className="font-medium">
                {talent.phone || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Plaats</p>
              <p className="font-medium">
                {talent.city}
              </p>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow border-2 p-6">

          <h2 className="text-lg font-semibold mb-5">
            Profiel
          </h2>

          <div className="space-y-5">

            <div>
              <p className="text-sm text-gray-500">
                Studierichting
              </p>

              <p className="font-medium">
                {talent.study || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Reisafstand
              </p>

              <p className="font-medium">
                {talent.distance
                  ? `${talent.distance} km`
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Beschikbaar vanaf
              </p>

              <p className="font-medium">
                {talent.available_from
                  ? new Date(
                      talent.available_from
                    ).toLocaleDateString("nl-NL")
                  : "-"}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Opmerkingen */}
      <div className="bg-white rounded-2xl shadow border-2 p-6">

        <h2 className="text-lg font-semibold mb-4">
          Opmerkingen
        </h2>

        <p className="whitespace-pre-line text-gray-700">
          {talent.notes || "Geen opmerkingen toegevoegd."}
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow border-2 p-6">

  <h2 className="text-lg font-semibold mb-4">
    Interne notities
  </h2>

  <textarea
    value={internalNotes}
    onChange={(e) => setInternalNotes(e.target.value)}
    rows={6}
    className="w-full rounded-xl border p-3"
    placeholder="Alleen zichtbaar voor de vereniging..."
  />

</div>

<div className="space-y-4">

  {saved && (
    <div className="rounded-xl border border-green-300 bg-green-100 px-4 py-3 text-green-700">
      ✓ Wijzigingen succesvol opgeslagen.
    </div>
  )}

  <div className="flex justify-end">

    <button
      onClick={saveChanges}
      disabled={saving || !hasChanges}
      className={`
        rounded-xl px-6 py-3 text-white transition
        ${
          saving || !hasChanges
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#0d1b2a] hover:bg-[#12263d]"
        }
      `}
    >
      {saving ? "Opslaan..." : "Wijzigingen opslaan"}
    </button>

  </div>

</div>

      {/* Terug */}
      <div>

        <Link
          href={`/club/${slug}/talent`}
          className="inline-flex px-5 py-3 rounded-xl bg-white border-2 hover:bg-gray-100 transition"
        >
          ← Terug naar Talentpool
        </Link>

      </div>

    </div>

    <ClubSupportBar />
  </main>
);
}