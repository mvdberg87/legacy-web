import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {

  const { email, clubId } = await req.json();

  if (!email || !clubId) {
    return NextResponse.json(
      { error: "Missing data" },
      { status: 400 }
    );
  }

  // check of user al bestaat
  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
  return NextResponse.json(
    { error: "Gebruiker bestaat al en is al gekoppeld" },
    { status: 400 }
  );
}

  // invite versturen
  const { data, error } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(email);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  // profile aanmaken
  await supabaseAdmin.from("profiles").insert({
    id: data.user.id,
    email: email,
    club_id: clubId,
    role: "club",
    active: true
  });

  return NextResponse.json({ success: true });
}