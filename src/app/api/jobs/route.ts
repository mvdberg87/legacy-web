import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

/* ===============================
   POST /api/jobs
   =============================== */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      club_id,
      title,
      company_name,
      job_url,
      is_featured = false, // 👈 advertentie
    } = body;

    if (!club_id || !title || !company_name || !job_url) {
      return NextResponse.json(
        { error: "Ontbrekende verplichte velden" },
        { status: 400 }
      );
    }

    /* ===============================
       1. Club + pakket ophalen
       =============================== */
    const { data: club, error: clubError } = await supabaseAdmin
      .from("clubs")
      .select("id, active_package")
      .eq("id", club_id)
      .maybeSingle();

    if (clubError || !club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    /* ===============================
       2. 🔒 PAKKET-CHECK (HARD)
       =============================== */
    if (club.active_package === "basic" && is_featured) {
      return NextResponse.json(
        {
          error:
            "Advertenties zijn niet beschikbaar in het Basic pakket. Upgrade om advertenties te gebruiken.",
          code: "PACKAGE_LIMIT",
        },
        { status: 403 }
      );
    }

    /* ===============================
       3. Vacature aanmaken
       =============================== */
    const { data: job, error: jobError } = await supabaseAdmin
      .from("sponsor_jobs")
      .insert({
        club_id,
        title,
        company_name,
        job_url,
        featured: is_featured,
      })
      .select()
      .single();

    if (jobError) {
      console.error(jobError);
      return NextResponse.json(
        { error: "Vacature aanmaken mislukt" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, job });
  } catch (err) {
    console.error("❌ api/jobs POST error:", err);
    return NextResponse.json(
      { error: "Interne serverfout" },
      { status: 500 }
    );
  }
}
