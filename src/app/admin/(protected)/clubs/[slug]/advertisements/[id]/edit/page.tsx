"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import LoadingCard from "@/components/ui/LoadingCard";
import EmptyState from "@/components/ui/EmptyState";
import ErrorCard from "@/components/ui/ErrorCard";

type Advertisement = {
  id: string;
  company_name: string;
  company_email: string;
  vacancy_url: string;
  status: string;
  start_date: string;
  end_date: string;
};

export default function EditAdvertisementPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const router = useRouter();
  const params = useParams();

  const slug = params.slug as string;
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [ad, setAd] = useState<Advertisement | null>(null);

  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {

  setLoading(true);

  try {

    const { data, error } = await supabase
      .from("company_advertisements")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    setAd(data);
    setJobTitle(data.job_title ?? "");

  } catch (err: any) {

    setError(
      err.message ?? "Er ging iets mis."
    );

  } finally {

    setLoading(false);

  }

}

  async function save() {
    if (!ad) return;

    setSaving(true);

    const { error } = await supabase
      .from("company_advertisements")
      .update({
        company_name: ad.company_name,
        job_title: jobTitle,
        vacancy_url: ad.vacancy_url,
        status: ad.status,
        start_date: ad.start_date,
        end_date: ad.end_date,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
  setError(error.message);
  setSaving(false);
  return;
}

    alert("Advertentie opgeslagen");

    router.push(`/admin/clubs/${slug}`);
  }

  if (loading) {

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <LoadingCard rows={6} />
    </div>
  );

}

if (error) {

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <ErrorCard message={error} />
    </div>
  );

}
  if (!ad) {

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <EmptyState
        title="Advertentie niet gevonden"
        description="Deze advertentie bestaat niet meer of is verwijderd."
      />
    </div>
  );

}

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">

        <h1 className="text-2xl font-semibold">
          Advertentie bewerken
        </h1>

        <div>
  <label className="block text-sm mb-1 text-black">
  Functietitel
</label>

 <input
  value={jobTitle}
  onChange={(e) => setJobTitle(e.target.value)}
  className="w-full border rounded-lg px-3 py-2 bg-white text-black"
/>
</div>

        <div>
          <label className="block text-sm mb-1 text-black">
            Bedrijfsnaam
          </label>

          <input
            value={ad.company_name}
            onChange={(e) =>
              setAd({
                ...ad,
                company_name: e.target.value,
              })
            }
            className="w-full border rounded-lg p-2 bg-white text-black"
          />
        </div>


        <div>
          <label className="block text-sm mb-1 text-black">
            Vacature URL
          </label>

          <input
            value={ad.vacancy_url}
            onChange={(e) =>
              setAd({
                ...ad,
                vacancy_url: e.target.value,
              })
            }
            className="w-full border rounded-lg p-2 bg-white text-black"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm mb-1 text-black">
              Startdatum
            </label>

            <input
              type="date"
              value={ad.start_date}
              onChange={(e) =>
                setAd({
                  ...ad,
                  start_date: e.target.value,
                })
              }
              className="w-full border rounded-lg p-2 bg-white text-black"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-black">
              Einddatum
            </label>

            <input
              type="date"
              value={ad.end_date}
              onChange={(e) =>
                setAd({
                  ...ad,
                  end_date: e.target.value,
                })
              }
              className="w-full border rounded-lg p-2 bg-white text-black"
            />
          </div>

        </div>

        <div className="flex gap-6">

        </div>

        <button
          onClick={save}
          disabled={saving}
          className="bg-green-600 text-white px-5 py-2 rounded-lg"
        >
          {saving ? "Opslaan..." : "Opslaan"}
        </button>

      </div>
    </div>
  );
}