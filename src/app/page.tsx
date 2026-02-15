// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getSupabase } from "../lib/supabaseClient"; // let op: ../lib/...

export const dynamic = "force-dynamic";

/** Types zoals Supabase ze kan teruggeven */
type ApiSponsor = {
  name?: string | null;
  logo_url?: string | null;
  website?: string | null;
};

type ApiJob = {
  id: string;
  title: string;
  location?: string | null;
  description?: string | null;
  apply_url: string | null;
  tags?: string[] | null;
  company_name?: string | null;
};

/** UI type */
type UiJob = {
  id: string;
  title: string;
  sponsor_name: string;
  location: string;
  description: string;
  apply_url: string;
  sponsor_url: string;
  logo_url: string;
  tags: string[];
};

/** Mapper API -> UI */
function toUiJob(j: ApiJob): UiJob {
  return {
    id: j.id,
    title: j.title ?? "",
    sponsor_name: j.company_name ?? "Sponsor",
    location: j.location ?? "",
    description: j.description ?? "",
    apply_url: j.apply_url ?? "#",
    sponsor_url: "#",
    logo_url: "https://placehold.co/64x64?text=Logo",
    tags: j.tags ?? [],
  };
}

export default async function Page() {
  let uiJobs: UiJob[] = [];
  let fatalError: string | null = null;

  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
  .from("jobs")
  .select(`
    id, title, location, description, apply_url, tags,
    company_name
  `)
      .eq("is_active", true)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(18);

    if (error) {
      fatalError = `Fout bij ophalen vacatures: ${error.message}`;
    } else {
      uiJobs = (data ?? []).map(toUiJob);
    }
  } catch (e: any) {
    fatalError = e?.message ?? "Onbekende fout tijdens laden.";
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-black" />
            <span className="font-semibold">Sponsorjobs</span>
          </div>
          <nav className="text-sm opacity-80">Vacatures</nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 pt-6">
        <h1 className="text-xl font-semibold mb-4">Recente vacatures</h1>

        {fatalError ? (
          <div className="max-w-xl bg-white border rounded-2xl shadow p-6">
            <p className="text-red-600 font-semibold">Er ging iets mis</p>
            <p className="text-sm mt-2 opacity-80 break-words">{fatalError}</p>
          </div>
        ) : uiJobs.length === 0 ? (
          <div className="max-w-xl bg-white border rounded-2xl shadow p-8">
            <p className="text-lg font-medium">Geen vacatures gevonden.</p>
            <p className="text-sm opacity-70 mt-1">
              Kom later terug of bekijk de clubpagina’s voor meer resultaten.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uiJobs.map((job) => (
              <Link
                key={job.id}
                href={job.apply_url || "#"}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-2xl bg-white border hover:shadow-md transition p-4"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={job.logo_url || "https://placehold.co/64x64?text=Logo"}
                    alt=""
                    width={32}
                    height={32}
                    unoptimized
                    className="h-8 w-8 rounded object-contain"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold truncate">{job.title}</h3>
                    <p className="text-xs opacity-70 truncate">
                      {job.sponsor_name}
                      {job.location ? ` • ${job.location}` : ""}
                    </p>
                  </div>
                </div>

                {job.description && (
                  <p className="mt-3 text-sm line-clamp-3 opacity-90">{job.description}</p>
                )}

                {job.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-full text-xs border border-gray-300">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t bg-white mt-10">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs opacity-70">
          © {new Date().getFullYear()} Sponsorjobs — sponsorjobs.nl
        </div>
      </footer>
    </main>
  );
}
