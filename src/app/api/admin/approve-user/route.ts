import { NextRequest, NextResponse } from "next/server";
import slugify from "@/lib/slugify";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { userId, email, clubName } = await req.json();
    if (!userId || !email) {
      return NextResponse.json({ error: "userId en email zijn verplicht" }, { status: 400 });
    }

    /* ===============================
   ADMIN AUTH CHECK
=============================== */

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name) {
        return req.cookies.get(name)?.value;
      },
    },
  }
);

const {
  data: { user: adminUser },
} = await supabase.auth.getUser();

if (!adminUser) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

const { data: profile, error: profileError } =
  await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("user_id", adminUser.id)
    .single();

if (
  profileError ||
  !profile ||
  profile.role !== "admin"
) {
  return NextResponse.json(
    { error: "Admin only" },
    { status: 403 }
  );
}

    const adminDb = supabaseAdmin;
    const slug = slugify(clubName || email.split("@")[0]);

    // 🏗️ Controleer of club al bestaat
    const { data: existing } = await adminDb
  .from("clubs")
  .select("id")
  .eq("public_slug", slug)
  .maybeSingle();

    let clubId = existing?.id;

    if (!clubId) {
      // Nieuwe club aanmaken
      const { data: newClub, error: clubError } = await adminDb
  .from("clubs")
        .insert({
  name: clubName || slug,
  slug,
  public_slug: slug,
  status: "approved",
})
        .select("id")
        .single();

      if (clubError) throw clubError;
      clubId = newClub.id;
    } else {
      // Bestaande club updaten naar approved
      const { error: updateError } = await adminDb
  .from("clubs")
        .update({ status: "approved" })
        .eq("id", clubId);
      if (updateError) throw updateError;
    }

    // 🔗 Profiel koppelen
    const { error: updateProfileError } = await adminDb
  .from("profiles")
  .update({ club_id: clubId })
  .eq("user_id", userId);

if (updateProfileError) {
  throw updateProfileError;
}

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
