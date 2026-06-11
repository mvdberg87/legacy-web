"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import ClubNavbar from "@/components/club/ClubNavbar";

/* ---------- Types ---------- */

type Job = {
  id: string;
  title: string;
  company_name: string;
  apply_url: string;
  club_id: string;
  activation_image_url: string | null;
};

type Club = {
  id: string;
  name: string;
  primary_color?: string | null;
  secondary_color?: string | null;
  advertising_sales_enabled?: boolean | null;
};

/* ---------- Pagina ---------- */

export default function EditJobPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const router = useRouter();
  const params = useParams();

  const slug = params.slug as string;
  const jobId = params.jobId as string;

  const [club, setClub] = useState<Club | null>(null);
  const [job, setJob] = useState<Job | null>(null);

  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [applyUrl, setApplyUrl] = useState("");
  const [activationImageUrl, setActivationImageUrl] =
  useState<string | null>(null);

const [uploadingImage, setUploadingImage] =
  useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("club_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile?.club_id) {
        setLoading(false);
        return;
      }

      const { data: clubData } = await supabase
        .from("clubs")
        .select("id, name, primary_color, secondary_color, advertising_sales_enabled")
        .eq("id", profile.club_id)
        .maybeSingle();

      setClub(clubData);

      const { data: jobData } = await supabase
        .from("jobs")
        .select("id, title, company_name, apply_url, club_id, activation_image_url")
        .eq("id", jobId)
        .maybeSingle();

      if (!jobData) {
        setLoading(false);
        return;
      }

      setJob(jobData);
      setTitle(jobData.title);
      setCompanyName(jobData.company_name);
      setApplyUrl(jobData.apply_url);
      setActivationImageUrl(jobData.activation_image_url);

      setLoading(false);
    })();
  }, [supabase, jobId]);

  async function handleActivationImageUpload(file: File) {
  if (!job) return;

  setUploadingImage(true);

  const fileExt = file.name.split(".").pop();

  const filePath =
    `${job.club_id}/job-${job.id}-activation-${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("job-images")
    .upload(filePath, file, {
      upsert: true,
    });

  if (error) {
    alert("Upload mislukt.");
    setUploadingImage(false);
    return;
  }

  const { data } = supabase.storage
    .from("job-images")
    .getPublicUrl(filePath);

  setActivationImageUrl(data.publicUrl);

  setUploadingImage(false);
}

  async function saveJob(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !companyName || !applyUrl) {
      alert("Vul alle velden in.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("jobs")
      .update({
  title: title.trim(),
  company_name: companyName.trim(),
  apply_url: applyUrl.trim(),
  activation_image_url: activationImageUrl,
})
      .eq("id", jobId);

    setSaving(false);

    if (error) {
      alert("Fout bij opslaan vacature");
      return;
    }

    router.push(`/club/${slug}/jobs`);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Laden…
      </main>
    );
  }

  if (!job || !club) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Vacature niet gevonden
      </main>
    );
  }

  const canUseManagedAds =
  club.advertising_sales_enabled === true;

  return (
    <main className="min-h-screen bg-[#0d1b2a] p-6">
      <ClubNavbar slug={slug} />

      <div className="max-w-3xl mx-auto bg-white border-2 border-[#0d1b2a] rounded-2xl p-6 shadow mt-6">
        <h1 className="text-2xl font-semibold mb-6 text-[#0d1b2a]">
          Vacature bewerken
        </h1>

        <form onSubmit={saveJob} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Bedrijfsnaam
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Functietitel
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Vacaturelink
            </label>
            <input
              type="url"
              value={applyUrl}
              onChange={(e) => setApplyUrl(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

{canUseManagedAds && (
          <div>
  <label className="block text-sm font-medium mb-2">
    Achtergrondfoto vacature
  </label>

  {activationImageUrl && (
    <p className="text-xs text-green-600 mb-2">
      ✔ Afbeelding geüpload
    </p>
  )}

  <label
    className="
      inline-block
      px-4
      py-2
      text-sm
      bg-[#0d1b2a]
      text-white
      rounded-lg
      cursor-pointer
    "
  >
    {activationImageUrl
      ? "Afbeelding wijzigen"
      : "Afbeelding uploaden"}

    <input
      type="file"
      accept="image/png,image/jpeg,image/webp"
      onChange={(e) =>
        e.target.files &&
        handleActivationImageUpload(
          e.target.files[0]
        )
      }
      className="hidden"
    />
  </label>

  {uploadingImage && (
    <p className="text-xs text-gray-500 mt-2">
      Afbeelding uploaden…
    </p>
  )}

  {activationImageUrl && (
    <div className="mt-4">
      <img
  src={activationImageUrl}
  alt="Achtergrondfoto vacature"
  className="
    max-h-64
    w-full
    object-contain
    border
    rounded-lg
    bg-gray-50
  "
/>
    </div>
  )}
</div>
)}

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-sm"
            >
              Annuleren
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition text-sm"
            >
              {saving ? "Opslaan…" : "Opslaan"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
