import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const { clubId } = await req.json();

  if (!clubId) {
    return NextResponse.json(
      { error: "clubId ontbreekt" },
      { status: 400 }
    );
  }

  const { data: club, error } = await supabaseAdmin
    .from("clubs")
    .select("admin_override")
    .eq("id", clubId)
    .single();

  if (error || !club) {
    return NextResponse.json(
      { error: "Club niet gevonden" },
      { status: 404 }
    );
  }

  await supabaseAdmin
    .from("clubs")
    .update({
      admin_override: !club.admin_override,
    })
    .eq("id", clubId);

  return NextResponse.json({ success: true });
}
