import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { clubId } = await req.json();

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id, user_id, active")
      .eq("club_id", clubId)
      .eq("active", true)
      .maybeSingle();

    // ✅ eerst checken
    if (!profile || error) {
      return NextResponse.json({ user: null });
    }

    // ✅ daarna pas gebruiken
    const userId = profile.user_id;

    const { data: user, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: userId,
        email: user.user?.email ?? null,
        active: profile.active,
      },
    });

  } catch (err) {
    console.error("GET CLUB USER ERROR:", err);

    return NextResponse.json({
      user: null,
      error: "Failed to fetch user",
    });
  }
}