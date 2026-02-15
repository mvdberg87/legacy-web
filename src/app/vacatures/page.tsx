import { getSupabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

type Job = {
  id: string;
  title: string;
  company_name: string;
  apply_url: string | null;
  featured: boolean;
  created_at: string;
};

export default async function VacaturesPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await getSupabaseServer();

  /* ===============================
     Club ophalen
     =============================== */
  const { data: club } = await supabase
    .from("clubs")
    .select("id, name")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!club) {
    return <p>Club niet gevonden</p>;
  }

  /* ===============================
     Vacatures ophalen
     =============================== */
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select(`
      id,
      title,
      company_name,
      apply_url,
      featured,
      created_at
    `)
    .eq("club_id", club.id)
    .eq("is_active", true)
    .is("archived_at", null)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return <p>Fout bij laden vacatures</p>;
  }

  /* ===============================
     Server Action: toggle featured
     =============================== */
  async function toggleFeatured(jobId: string, current: boolean) {
    "use server";

    const supabase = await getSupabaseServer();

    await supabase
      .from("jobs")
      .update({ featured: !current })
      .eq("id", jobId);

    revalidatePath(`/club/${params.slug}/vacatures`);
    revalidatePath(`/club/${params.slug}/dashboard`);
    revalidatePath(`/club/${params.slug}/jobs/public`);
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">
        💼 Vacatures – {club.name}
      </h1>
      <p className="text-gray-600 mb-8">
        Beheer en markeer vacatures als uitgelicht
      </p>

      {jobs.length === 0 ? (
        <p className="text-gray-500 italic">
          Nog geen vacatures aangemaakt.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <article
              key={job.id}
              className={`border rounded-xl p-6 flex items-center justify-between ${
                job.featured
                  ? "border-yellow-400 bg-yellow-50"
                  : "bg-white"
              }`}
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {job.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {job.company_name}
                </p>

                {job.featured && (
                  <span className="inline-block mt-2 text-xs font-medium text-yellow-700">
                    ⭐ Uitgelichte vacature
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* ⭐ Toggle featured */}
                <form
                  action={async () => {
                    await toggleFeatured(job.id, job.featured);
                  }}
                >
                  <button
                    type="submit"
                    className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                      job.featured
                        ? "border-yellow-500 text-yellow-700"
                        : "border-gray-300 text-gray-600"
                    }`}
                  >
                    {job.featured ? "Unfeature" : "Feature"}
                  </button>
                </form>

                {/* Bewerken */}
                <Link
                  href={`/club/${params.slug}/vacatures/${job.id}`}
                  className="px-3 py-1 rounded-lg border text-sm"
                >
                  ✏️ Bewerken
                </Link>

                {/* Externe link */}
                {job.apply_url && (
                  <Link
                    href={job.apply_url}
                    target="_blank"
                    className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm"
                  >
                    Bekijken
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
