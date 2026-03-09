"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import ClubNavbar from "@/components/club/ClubNavbar";

type Club = {
  id: string;
  name: string;
  primary_color?: string | null;
  secondary_color?: string | null;
};

export default function NewJobPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const router = useRouter();
  const params = useParams();

  const slug = params.slug as string;

  const [club, setClub] = useState<Club | null>(null);

  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [applyUrl, setApplyUrl] = useState("");

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
        .select("id, name, primary_color, secondary_color")
        .eq("id", profile.club_id)
        .maybeSingle();

      setClub(clubData);

      setLoading(false);
    })();
  }, [supabase]);

  async function createJob(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !companyName || !applyUrl) {
      alert("Vul alle velden in.");
      return;
    }

    if (!club) return;

    setSaving(true);

    const { error } = await supabase
      .from("jobs")
      .insert({
        title: title.trim(),
        company_name: companyName.trim(),
        apply_url: applyUrl.trim(),
        club_id: club.id,
        featured: false,
      });

    setSaving(false);

    if (error) {
      alert("Fout bij toevoegen vacature");
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

  if (!club) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Club niet gevonden
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d1b2a] p-6">

      <ClubNavbar slug={slug} />

      <div className="max-w-3xl mx-auto bg-white border-2 border-[#0d1b2a] rounded-2xl p-6 shadow mt-6">

        <h1 className="text-2xl font-semibold mb-6 text-[#0d1b2a]">
          Vacature toevoegen
        </h1>

        <form onSubmit={createJob} className="space-y-4">

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

          <div className="flex justify-between items-center pt-4">

            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm"
            >
              Annuleren
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 text-sm"
            >
              {saving ? "Opslaan…" : "Vacature toevoegen"}
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}