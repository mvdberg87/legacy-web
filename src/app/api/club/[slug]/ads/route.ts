import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  SUBSCRIPTIONS,
  type PackageKey,
} from "@/lib/subscriptions";
import { canCreateAd } from "@/lib/permissions";

/* ===============================
   Types (Next 15 compatible)
=============================== */

type Params = {
  params: Promise<{ slug: string }>;
};

type CreateAdBody = {
  company_name: string;
  link_url: string;
  image_url?: string | null;
  is_featured?: boolean;
};

/* ============================================================
   GET – advertenties ophalen (handmatig + featured vacatures)
============================================================ */

export async function GET(
  req: NextRequest,
  { params }: Params
) {
  const { slug } = await params;

  /* 1️⃣ Club ophalen */
  const { data: club, error: clubError } =
    await supabaseAdmin
      .from("clubs")
      .select("id, name, subscription_status")
      .eq("slug", slug)
      .maybeSingle();

  if (clubError || !club) {
    return NextResponse.json(
      { error: "Club niet gevonden" },
      { status: 404 }
    );
  }

  /* 2️⃣ Alle actieve advertenties ophalen */
  const { data: ads, error } =
    await supabaseAdmin
      .from("club_ads")
      .select(`
        id,
        company_name,
        link_url,
        image_url,
        is_active,
        is_featured,
        job_id,
        jobs (
          title
        )
      `)
      .eq("club_id", club.id)
      .eq("is_active", true)
      .is("archived_at", null)
      .order("created_at", { ascending: false });

  if (error) {
    console.error("Ads fetch error:", error);
    return NextResponse.json(
      { error: "Kon advertenties niet ophalen" },
      { status: 500 }
    );
  }

  /* 3️⃣ Mapping */
  const mappedAds =
    ads?.map((ad: any) => ({
      id: ad.id,
      company_name: ad.company_name,
      link_url: ad.link_url,
      image_url: ad.image_url,
      is_active: ad.is_active,
      is_featured: ad.is_featured,
      job_id: ad.job_id,
      job_title: ad.jobs?.title ?? null,
    })) ?? [];

  return NextResponse.json({
    club,
    ads: mappedAds,
  });
}

/* ============================================================
   POST – advertentie aanmaken
   (MET juiste limietcontrole inclusief featured vacatures)
============================================================ */

export async function POST(
  req: NextRequest,
  { params }: Params
) {
  const { slug } = await params;

  /* 1️⃣ Body valideren */
  let body: CreateAdBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Ongeldige request body" },
      { status: 400 }
    );
  }

  if (!body.company_name || !body.link_url) {
    return NextResponse.json(
      { error: "company_name en link_url zijn verplicht" },
      { status: 400 }
    );
  }

  /* 2️⃣ Club ophalen */
  const { data: club, error: clubError } =
    await supabaseAdmin
      .from("clubs")
      .select("id, active_package, admin_override")
      .eq("slug", slug)
      .maybeSingle();

  if (clubError || !club) {
    return NextResponse.json(
      { error: "Club niet gevonden" },
      { status: 404 }
    );
  }

  /* 3️⃣ Actief pakket bepalen */
  const activePackage: PackageKey =
    club.active_package &&
    club.active_package in SUBSCRIPTIONS
      ? club.active_package
      : "basic";

  /* ============================================================
     4️⃣ TOTAAL aantal advertenties tellen
     (handmatig + featured vacatures)
  ============================================================ */

  /* Handmatige advertenties */
  const { count: manualCount, error: manualCountError } =
    await supabaseAdmin
      .from("club_ads")
      .select("id", { count: "exact", head: true })
      .eq("club_id", club.id)
      .eq("is_active", true)
      .is("archived_at", null);

  if (manualCountError) {
    console.error("Manual ads count error:", manualCountError);
    return NextResponse.json(
      { error: "Kon advertenties niet tellen" },
      { status: 500 }
    );
  }

  /* Featured vacatures */
  const { count: featuredCount, error: featuredCountError } =
    await supabaseAdmin
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("club_id", club.id)
      .eq("featured", true)
      .eq("is_active", true)
      .is("archived_at", null);

  if (featuredCountError) {
    console.error("Featured jobs count error:", featuredCountError);
    return NextResponse.json(
      { error: "Kon vacature-advertenties niet tellen" },
      { status: 500 }
    );
  }

  const currentAds =
    (manualCount ?? 0) + (featuredCount ?? 0);

  /* ============================================================
     5️⃣ Limiet-check
  ============================================================ */

  const allowed = canCreateAd({
    activePackage,
    currentAds,
    adminOverride: club.admin_override,
  });

  if (!allowed) {
    const maxAds = SUBSCRIPTIONS[activePackage].ads;

    return NextResponse.json(
      {
        error: "Advertentielimiet bereikt",
        reason: "upgrade_required",
        currentAds,
        maxAds:
          maxAds === Number.POSITIVE_INFINITY
            ? null
            : maxAds,
        message:
          maxAds === 0
            ? "Dit pakket bevat geen advertenties. Upgrade om advertenties te plaatsen."
            : "Je hebt het maximale aantal advertenties bereikt. Verwijder een advertentie of upgrade je pakket.",
      },
      { status: 403 }
    );
  }

  /* ============================================================
     6️⃣ Advertentie aanmaken
  ============================================================ */

  const { data: ad, error: insertError } =
    await supabaseAdmin
      .from("club_ads")
      .insert({
        club_id: club.id,
        company_name: body.company_name,
        link_url: body.link_url,
        image_url: body.image_url ?? null,
        is_featured: body.is_featured ?? false,
        is_active: true,
      })
      .select()
      .single();

  if (insertError) {
    console.error("Insert ad error:", insertError);
    return NextResponse.json(
      { error: "Advertentie aanmaken mislukt" },
      { status: 500 }
    );
  }

  const newCount = currentAds + 1;
  const maxAds = SUBSCRIPTIONS[activePackage].ads;

  return NextResponse.json(
    {
      ad,
      adsCountAfter: newCount,
      maxAds:
        maxAds === Number.POSITIVE_INFINITY
          ? null
          : maxAds,
    },
    { status: 201 }
  );
}
