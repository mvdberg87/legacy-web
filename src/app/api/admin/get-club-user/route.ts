import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { clubId } = await req.json();

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("user_id, active")
    .eq("club_id", clubId)
    .eq("active", true)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ user: null });
  }

  const { data: user } =
    await supabaseAdmin.auth.admin.getUserById(profile.user_id);

  return NextResponse.json({
    user: {
      id: profile.user_id,
      email: user.user?.email,
      active: profile.active,
    },
  });
}