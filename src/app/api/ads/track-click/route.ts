import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const body = await req.json();

  await supabaseAdmin.from("ad_clicks").insert({
    ad_id: body.ad_id,
    club_id: body.club_id,
  });

  return Response.json({ success: true });
}