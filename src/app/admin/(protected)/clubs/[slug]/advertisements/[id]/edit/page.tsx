"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

type Advertisement = {
  id: string;
  company_name: string;
  company_email: string;
  company_website: string;
  vacancy_url: string;
  status: string;
  is_featured: boolean;
  auto_renew: boolean;
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
  const [saving, setSaving] = useState(false);

  const [ad, setAd] = useState<Advertisement | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("company_advertisements")
      .select("*")
      .eq("id", id)
      .single();

    setAd(data);
    setLoading(false);
  }

  async function save() {
    if (!ad) return;

    setSaving(true);

    const { error } = await supabase
      .from("company_advertisements")
      .update({
        company_name: ad.company_name,
        company_email: ad.company_email,
        company_website: ad.company_website,
        vacancy_url: ad.vacancy_url,
        status: ad.status,
        is_featured: ad.is_featured,
        auto_renew: ad.auto_renew,
        start_date: ad.start_date,
        end_date: ad.end_date,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Advertentie opgeslagen");

    router.push(`/admin/clubs/${slug}`);
  }

  if (loading) return <p>Laden...</p>;
  if (!ad) return <p>Advertentie niet gevonden</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">

        <h1 className="text-2xl font-semibold">
          Advertentie bewerken
        </h1>

        <div>
          <label className="block text-sm mb-1">
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
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            E-mail
          </label>

          <input
            value={ad.company_email}
            onChange={(e) =>
              setAd({
                ...ad,
                company_email: e.target.value,
              })
            }
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Website
          </label>

          <input
            value={ad.company_website}
            onChange={(e) =>
              setAd({
                ...ad,
                company_website: e.target.value,
              })
            }
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
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
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm mb-1">
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
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
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
              className="w-full border rounded-lg p-2"
            />
          </div>

        </div>

        <div className="flex gap-6">

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={ad.is_featured}
              onChange={(e) =>
                setAd({
                  ...ad,
                  is_featured: e.target.checked,
                })
              }
            />
            Uitgelicht
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={ad.auto_renew}
              onChange={(e) =>
                setAd({
                  ...ad,
                  auto_renew: e.target.checked,
                })
              }
            />
            Auto renew
          </label>

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