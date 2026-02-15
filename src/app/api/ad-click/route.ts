// src/app/api/ad-click/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
);

export async function POST(req: Request) {
  try {
    const { adId, clubId } = await req.json();

    if (!adId || !clubId) {
      return NextResponse.json(
        { error: "Missing adId or clubId" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("club_ad_clicks").insert({
      ad_id: adId,
      club_id: clubId,
    });

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to track ad click" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ API error:", err);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
