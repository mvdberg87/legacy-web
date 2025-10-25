// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getSupabase } from "@/lib/supabaseClient";

/** --- API types (zoals Supabase ze teruggeeft) --- */
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
  sponsors?: ApiSponsor[] | null; // <-- array, niet enkel object
};

/** --- UI type (wat de component toont) --- */
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

/** --- Mapper van API -> UI --- */
function toUiJob(j: ApiJob): UiJob {
  const s = (j.sponsors ?? [])[0] ?? {};
  return {
    id: j.id,
    title: j.title ?? "",
    sponsor_name: s.name ?? "Sponsor",
    location: j.location ?? "",
    description: j.description ?? "",
    apply_url: j.apply_url ?? "#",
    sponsor_url: s.website ?? "#",
    logo_url: s.logo_url ?? "https://placehold.co/64x64?text=Logo",
    tags: j.tags ?? [],
  };
}

export default async function Page() {
  const supabase = getSupabase();

  // Haal de laatste 18 vacatures op (algemene homepage)
  const { data, error } = await supabase
    .from("jobs")
    .select(`
      id, title, location, description, apply_url, tags,
      sponsors:sponsors ( name, logo_url, website )
    `)
    .eq("is_active", true)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(18);

  if (error) {
    throw new Error(`Fout bij ophalen vacatures: ${error.message}`);
  }

  const jobs = (data ?? []) as unknown as ApiJob[];
  const uiJobs: UiJob[] = jobs.map(toUiJob);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-black" />
            <span className="font-semibold">Legacy</span>
          </div>
          <nav className="text-sm opacity-80">Vacatures</nav>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 pt-6">
        <h1 className="text-xl font-semibold mb-4">Recente vacatures</h1>

        {uiJobs.length === 0 ? (
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
                href={job.apply_url}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-2xl bg-white border hover:shadow-md transition p-4"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={job.logo_url}
                    alt=""
                    width={32}
                    height={32}
                    unoptimized
                    className="h-8 w-8 rounded object-contain"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold truncate">
                      {job.title}
                    </h3>
                    <p className="text-xs opacity-70 truncate">
                      {job.sponsor_name}
                      {job.location ? ` • ${job.location}` : ""}
                    </p>
                  </div>
                </div>

                {job.description && (
                  <p className="mt-3 text-sm line-clamp-3 opacity-90">
                    {job.description}
                  </p>
                )}

                {job.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-full text-xs border border-gray-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2 text-sm">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    className="opacity-70"
                    aria-hidden="true"
                  >
                    <path
                      d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"
                      fill="currentColor"
                    />
                    <path
                      d="M5 5h5V3H3v7h2V5zm0 14v-5H3v7h7v-2H5z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="underline decoration-dotted">
                    Naar vacaturewebsite
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-10">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs opacity-70">
          © {new Date().getFullYear()} Legacy — legacy.eu
        </div>
      </footer>
    </main>
  );
}

