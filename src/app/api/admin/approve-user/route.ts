import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import slugify from "@/lib/slugify";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { userId, email, clubName } = await req.json();
    if (!userId || !email) {
      return NextResponse.json({ error: "userId en email zijn verplicht" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const slug = slugify(clubName || email.split("@")[0]);

    // 🏗️ Controleer of club al bestaat
    const { data: existing } = await supabase
      .from("clubs")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    let clubId = existing?.id;

    if (!clubId) {
      // Nieuwe club aanmaken
      const { data: newClub, error: clubError } = await supabase
        .from("clubs")
        .insert({
          name: clubName || slug,
          slug,
          status: "approved",
        })
        .select("id")
        .single();

      if (clubError) throw clubError;
      clubId = newClub.id;
    } else {
      // Bestaande club updaten naar approved
      const { error: updateError } = await supabase
        .from("clubs")
        .update({ status: "approved" })
        .eq("id", clubId);
      if (updateError) throw updateError;
    }

    // 🔗 Profiel koppelen
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ club_id: clubId })
      .eq("user_id", userId);

    if (profileError) throw profileError;

    // ✅ Alles geslaagd
    return NextResponse.json({ ok: true, message: "Club goedgekeurd en gekoppeld" });
  } catch (err: any) {
    console.error("❌ Fout in approve-user route:", err);
    return NextResponse.json(
      { error: err.message || "Er is iets misgegaan in approve-user" },
      { status: 500 }
    );
  }
}
