import { getSupabase } from "../../../lib/supabaseClient";
import LegacySwipeAndList from "../../../components/LegacySwipeAndList";

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = getSupabase();

  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .select("id, slug, name")
    .eq("slug", params.slug)
    .single();

  if (clubError || !club) {
    return <div className="p-6">Club niet gevonden: {params.slug}</div>;
  }

  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select(`
      id, title, location, description, apply_url, tags,
      sponsors:sponsors ( name, logo_url, website )
    `)
    .eq("club_id", club.id)
    .eq("is_active", true)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (jobsError) {
    return <div className="p-6">Fout bij ophalen vacatures: {jobsError.message}</div>;
  }

  const initialJobs = (jobs ?? []).map((j: any) => ({
    id: j.id,
    title: j.title,
    sponsor_name: j.sponsors?.name ?? "Sponsor",
    location: j.location ?? "",
    tags: j.tags ?? [],
    description: j.description ?? "",
    apply_url: j.apply_url ?? "#",
    sponsor_url: j.sponsors?.website ?? "#",
    logo_url: j.sponsors?.logo_url ?? "",
  }));

  return <LegacySwipeAndList initialJobs={initialJobs} />;
}
