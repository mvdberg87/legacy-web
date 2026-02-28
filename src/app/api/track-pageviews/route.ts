import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("PAGEVIEW BODY:", body);

    const { clubId } = body;

    if (!clubId) {
      console.log("NO CLUB ID");
      return NextResponse.json({ error: "No clubId" }, { status: 400 });
    }

    await supabaseAdmin.from("club_page_views").insert({
      club_id: clubId,
      ip_address: req.headers.get("x-forwarded-for"),
      user_agent: req.headers.get("user-agent"),
    });

    console.log("PAGEVIEW INSERTED");

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PAGEVIEW ERROR:", e);
    return NextResponse.json({ error: "fail" }, { status: 500 });
  }
}