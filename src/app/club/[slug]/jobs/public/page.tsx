import { getSupabaseServer } from "@/lib/supabaseServer";
import ClientPage from "./ClientPage";

export const dynamic = "force-dynamic";

const DEFAULT_PUBLIC_JOBS_INTRO = `
Onze club is meer dan sport alleen. Samen met onze sponsoren bouwen we aan een sterk netwerk waarin sport, werk en talent samenkomen.
`;

type PageProps = {
  params: { slug: string };
};

export default async function PublicJobsPage({ params }: PageProps) {
  const supabase = await getSupabaseServer();
  const { slug } = await params;

  /* ===============================
     1️⃣ Club ophalen
     =============================== */
  const { data: club } = await supabase
    .from("clubs")
    .select(
      "id, name, slug, primary_color, secondary_color, jobs_intro_text"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!club) {
    return <p className="p-8">Club niet gevonden</p>;
  }

  /* ===============================
     2️⃣ Vacatures ophalen
     =============================== */
  const { data: jobs } = await supabase
    .from("jobs")
    .select(`
      id,
      title,
      company_name,
      apply_url,
      created_at,
      featured,
      company_website,
      company_logo_url
    `)
    .eq("club_id", club.id)
    .eq("is_active", true)
    .is("archived_at", null)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  /* ===============================
     3️⃣ Advertenties uit featured vacatures
     =============================== */
  const featuredJobAds =
  (jobs ?? [])
    .filter((job) => job.featured)
    .map((job) => ({
      id: `job-${job.id}`,
      job_title: job.title,   // ✅ BELANGRIJK
      company_name: job.company_name,
      link_url: job.apply_url,
      image_url: job.company_logo_url,
      is_featured: true,
    }));

  /* ===============================
     4️⃣ Handmatige advertenties
     =============================== */
  const { data: manualAds } = await supabase
    .from("club_ads")
    .select(`
      id,
      company_name,
      image_url,
      link_url,
      is_featured,
      job_id
    `)
    .eq("club_id", club.id)
    .eq("is_active", true)
    .is("archived_at", null)
    .is("job_id", null) // alleen echte handmatige ads
    .order("is_featured", { ascending: false });

  /* ===============================
     5️⃣ Vacatures mappen (zonder featured)
     =============================== */
  const jobsMapped =
    (jobs ?? [])
      .filter((job) => !job.featured) // geen dubbele weergave
      .map((job) => ({
        id: job.id,
        job_title: job.title,
        company_name: job.company_name,
        created_at: job.created_at,
        apply_url: job.apply_url,
        is_featured: job.featured,
        company_website: job.company_website,
        company_logo_url: job.company_logo_url,
      }));

  /* ===============================
     6️⃣ Advertenties combineren
     =============================== */
  const combinedAds = [
    ...featuredJobAds,
    ...(manualAds ?? []),
  ];

  /* ===============================
     7️⃣ Render
     =============================== */
  return (
    <ClientPage
      club={{
        id: club.id,
        name: club.name,
        slug: club.slug,
        primary_color: club.primary_color,
        secondary_color: club.secondary_color,
      }}
      introText={
        club.jobs_intro_text?.trim() ||
        DEFAULT_PUBLIC_JOBS_INTRO
      }
      jobs={jobsMapped}
      ads={combinedAds}
    />
  );
}
