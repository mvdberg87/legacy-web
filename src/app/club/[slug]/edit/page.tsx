"use client";

import ClubSupportBar from "@/components/ClubSupportBar";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import ClubNavbar from "@/components/club/ClubNavbar";
import { DEFAULT_PUBLIC_JOBS_INTRO } from "@/lib/defaultTexts";

/* ---------- Types ---------- */

type Club = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  slug: string;
  jobs_intro_text: string;
};

/* ---------- Pagina ---------- */

export default function ClubEditPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* ---------- Club ophalen ---------- */

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) {
        setError("Kon clubgegevens niet laden.");
      } else {
        setClub({
          ...data,
          jobs_intro_text:
  data.jobs_intro_text ?? DEFAULT_PUBLIC_JOBS_INTRO,
        });
      }

      setLoading(false);
    })();
  }, [slug, supabase]);

  /* ---------- Logo upload ---------- */

  async function handleLogoUpload(file: File) {
    if (!club) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Alleen PNG of JPG toegestaan.");
      return;
    }

    setUploadingLogo(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `${club.id}/logo-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("club-logos")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert("Upload mislukt.");
      setUploadingLogo(false);
      return;
    }

    const { data } = supabase.storage
  .from("club-logos")
  .getPublicUrl(filePath);

const publicUrlWithCacheBust = `${data.publicUrl}?t=${Date.now()}`;

setClub((c) =>
  c ? { ...c, logo_url: publicUrlWithCacheBust } : c
);

    setUploadingLogo(false);
  }

  /* ---------- Opslaan ---------- */

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!club) return;

    console.log("📝 OPSLAAN CLUB:", {
  id: club.id,
  slug: club.slug,
  jobs_intro_text: club.jobs_intro_text,
});

    setSaving(true);
    setError(null);
    setSuccess(null);

    const cleanedText = club.jobs_intro_text.trim();

const { data: updateData, error: updateError } = await supabase
  .from("clubs")
  .update({
    name: club.name,
    logo_url: club.logo_url,
    jobs_intro_text:
      cleanedText === DEFAULT_PUBLIC_JOBS_INTRO
        ? null
        : cleanedText,
  })
  .eq("id", club.id)
  .select();

console.log("UPDATE RESULT:", updateData, updateError);

    if (updateError) {
      setError("Fout bij opslaan.");
    } else {
      setSuccess("Clubgegevens succesvol opgeslagen.");
      setTimeout(() => {
        router.push(`/club/${club.slug}/dashboard`);
      }, 1200);
    }

    setSaving(false);
  }

  /* ---------- States ---------- */

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center">
        Laden…
      </main>
    );

  if (!club)
    return (
      <main className="min-h-screen flex items-center justify-center">
        Geen clubinformatie gevonden.
      </main>
    );

  /* ---------- Render ---------- */

  return (
    <main className="min-h-screen bg-[#0d1b2a] p-6">
      <ClubNavbar slug={slug} />

      <div className="max-w-xl mx-auto bg-white border-2 border-[#0d1b2a] rounded-2xl p-6 shadow mt-8">
        <h1 className="text-2xl font-semibold mb-6 text-[#0d1b2a]">
          Clubgegevens bewerken
        </h1>

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Naam */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Naam
            </label>
            <input
              type="text"
              value={club.name}
              onChange={(e) =>
                setClub({ ...club, name: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Intro vacatures */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Introductietekst vacatures
            </label>
            <textarea
              rows={8}
              value={club.jobs_intro_text}
              onChange={(e) =>
                setClub({
                  ...club,
                  jobs_intro_text: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <button
  type="button"
  onClick={() =>
    setClub({
      ...club,
      jobs_intro_text: DEFAULT_PUBLIC_JOBS_INTRO,
    })
  }
  className="text-xs text-blue-600 underline mt-2"
>
  Standaardtekst herstellen
</button>

          {/* Logo upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
  Clublogo (PNG of JPG)
</label>

{club.logo_url && (
  <p className="text-xs text-green-600 mb-2">
    ✔ Logo geüpload
  </p>
)}

            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) =>
                e.target.files &&
                handleLogoUpload(e.target.files[0])
              }
              className="text-sm"
            />

            {uploadingLogo && (
              <p className="text-xs text-gray-500 mt-1">
                Logo uploaden…
              </p>
            )}

            {club.logo_url && (
              <div className="mt-4">
                <img
                  src={club.logo_url}
                  alt="Club logo"
                  className="h-24 object-contain border rounded-lg mx-auto"
                />
              </div>
            )}
          </div>

          {/* Acties */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() =>
                router.push(`/club/${club.slug}/dashboard`)
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
            >
              Terug
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-green-600 text-white px-4 py-2 font-semibold hover:bg-green-700 text-sm"
            >
              {saving ? "Opslaan…" : "Opslaan"}
            </button>
          </div>
        </form>
            </div>

      {/* ===============================
          Support balk
      =============================== */}
      <ClubSupportBar />

    </main>
  );
}
