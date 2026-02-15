import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Params = {
  params: Promise<{ slug: string; adId: string }>;
};

export async function GET(
  _req: Request,
  { params }: Params
) {
  const { slug, adId } = await params;

  // Club ophalen
  const { data: club } = await supabaseAdmin
    .from("clubs")
    .select("id, name, primary_color")
    .eq("slug", slug)
    .maybeSingle();

  if (!club) {
    return NextResponse.json(
      { error: "Club niet gevonden" },
      { status: 404 }
    );
  }

  // Advertentie ophalen
  const { data: ad } = await supabaseAdmin
    .from("club_ads")
    .select("id, company_name, link_url, cta_text, image_url")
    .eq("id", adId)
    .eq("club_id", club.id)
    .eq("is_active", true)
    .is("archived_at", null)
    .maybeSingle();

  if (!ad) {
    return NextResponse.json(
      { error: "Advertentie niet gevonden" },
      { status: 404 }
    );
  }

  return NextResponse.json({ club, ad });
}
