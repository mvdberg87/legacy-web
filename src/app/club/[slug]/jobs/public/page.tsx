import { getSupabaseServer } from "@/lib/supabase.server";
import ClientPage from "./ClientPage";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  DEFAULT_PUBLIC_JOBS_INTRO,
  DEFAULT_PUBLIC_JOBS_CTA_TITLE,
  DEFAULT_PUBLIC_JOBS_CTA_TEXT,
} from "@/lib/defaultTexts";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type PageProps = {
  params: { slug: string };
};

export default async function PublicJobsPage({ params }: PageProps) {
  const supabase = await getSupabaseServer();
  const { slug } = params;

  /* ===============================
     1️⃣ Club ophalen
     =============================== */
  const { data: club } = await supabase
  .from("clubs")
  .select(
  `
    id,
    name,
    slug,
    logo_url,
    primary_color,
    secondary_color,
    advertising_sales_enabled,
talentpool_enabled,
    jobs_intro_text,
    jobs_cta_title,
    jobs_cta_text
  `
)
  .eq("public_slug", slug)
  .maybeSingle();

   if (!club) {
    return <p className="p-8">Club niet gevonden</p>;
  }

  // Admin e-mail ophalen
const { data: adminProfile } = await supabase
  .from("profiles")
  .select("email")
  .eq("club_id", club?.id)
  .limit(1)
  .maybeSingle();

const adminEmail = adminProfile?.email ?? null;

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
    company_logo_url,
    is_active,
    is_approved,
    archived_at
  `)
  .eq("club_id", club.id)
  .eq("is_active", true)
  .eq("is_approved", true)
  .is("archived_at", null)
  .order("featured", { ascending: false })
  .order("created_at", { ascending: false });

  /* ===============================
   2b️⃣ Clicks ophalen
================================ */

const jobIds = (jobs ?? []).map((j) => j.id);

let clickMap: Record<string, number> = {};

if (jobIds.length > 0) {
  const { data: clicks } = await supabase
    .from("job_clicks")
    .select("job_id")
    .in("job_id", jobIds);

  clickMap = (clicks ?? []).reduce((acc: Record<string, number>, c) => {
    acc[c.job_id] = (acc[c.job_id] || 0) + 1;
    return acc;
  }, {});
}

  /* ===============================
     3️⃣ Advertenties uit featured vacatures
     =============================== */
  const featuredJobAds =
  (jobs ?? [])
    .filter((job) => job.featured)
    .map((job) => ({
      id: `job-${job.id}`,
      title: job.title,
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
    link_url,
    image_url,
    is_featured,
    job_id
`)
    .eq("club_id", club.id)
    .eq("is_active", true)
    .is("archived_at", null)
    .is("job_id", null) // alleen echte handmatige ads
    .order("is_featured", { ascending: false });

    /* ===============================
   4b️⃣ Marketplace advertenties
=============================== */

const {
  data: marketplaceAds,
  error: marketplaceError,
} = await supabaseAdmin
  .from("company_advertisements")
  .select(`
  id,
  title,
  company_name,
  company_website,
  vacancy_url,
  logo_url,
  is_featured,
  created_at
`)
  .eq("club_id", club.id)
  .eq("status", "active")
  .is("deleted_at", null);

console.log(
  "MARKETPLACE ERROR",
  marketplaceError
);

console.log(
  "MARKETPLACE ADS",
  marketplaceAds
);

  /* ===============================
     5️⃣ Vacatures mappen (zonder featured)
     =============================== */
  const jobsMapped =
  (jobs ?? []).map((job) => ({
    id: job.id,
    title: job.title,
    company_name: job.company_name,
    created_at: job.created_at,
    apply_url: job.apply_url,
    is_featured: job.featured,
    company_website: job.company_website,
    company_logo_url: job.company_logo_url,
    source: "job" as const,
    total_clicks: clickMap[job.id] ?? 0,
    ctr: 0,
  }));

  /* ===============================
     6️⃣ Advertenties combineren
     =============================== */
  const marketplaceAdsMapped =
  (marketplaceAds ?? [])
    .filter((ad) => ad.is_featured)
    .map((ad) => ({
      id: ad.id,
      company_name: ad.company_name,
      title: ad.title,
      link_url: ad.vacancy_url,
      image_url: ad.logo_url,
      is_featured: ad.is_featured,
    }));

    const manualAdsMapped =
  (manualAds ?? []).map((ad) => ({
    id: ad.id,
    title: "Vacature bekijken",
    company_name: ad.company_name,
    link_url: ad.link_url,
    image_url: ad.image_url,
    is_featured: ad.is_featured,
  }));

const combinedAds = [
  ...featuredJobAds,
  ...(marketplaceAdsMapped ?? []),
  ...(manualAds ?? []),
];

const marketplaceJobsMapped =
  (marketplaceAds ?? [])
    .filter((ad) => !ad.is_featured)
    .map((ad) => ({
      id: ad.id,
      title: ad.title,
      company_name: ad.company_name,
      created_at: ad.created_at,
      apply_url: ad.vacancy_url,
      is_featured: false,
      company_website: ad.company_website,
      company_logo_url: ad.logo_url,
      source: "advertisement" as const,
      total_clicks: 0,
      ctr: 0,
    }));

  /* ===============================
     7️⃣ Render
     =============================== */
  return (
    <ClientPage
  club={{
  id: club.id,
  name: club.name,
  slug: club.slug,
  logo_url: club.logo_url,
  primary_color: club.primary_color,
  secondary_color: club.secondary_color,
  advertising_sales_enabled: club.advertising_sales_enabled,
  talentpool_enabled: club.talentpool_enabled,
}}
  adminEmail={adminEmail}
  introText={
    club.jobs_intro_text?.trim() ||
    DEFAULT_PUBLIC_JOBS_INTRO
  }
  ctaTitle={
    club.jobs_cta_title?.trim() ||
    DEFAULT_PUBLIC_JOBS_CTA_TITLE
  }
  ctaText={
    club.jobs_cta_text?.trim() ||
    DEFAULT_PUBLIC_JOBS_CTA_TEXT
  }
  jobs={[
    ...jobsMapped,
    ...marketplaceJobsMapped,
  ]}
  ads={combinedAds}
/>
  );
}
