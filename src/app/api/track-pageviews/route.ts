import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const { clubId } = await req.json();

  if (!clubId) return NextResponse.json({});

  await supabaseAdmin.from("club_page_views").insert({
    club_id: clubId,
    ip_address: req.headers.get("x-forwarded-for"),
    user_agent: req.headers.get("user-agent"),
  });

  return NextResponse.json({ success: true });
}