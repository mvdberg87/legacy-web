import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase.server";


export async function POST(req: Request) {
  const supabase = await getSupabaseServer();
  const { job_url, platform } = await req.json();

  if (!job_url || !platform) {
    return NextResponse.json({ ok: false });
  }

  // job ophalen op basis van apply_url
  const { data: job } = await supabase
    .from("jobs")
    .select("id, club_id")
    .eq("apply_url", job_url)
    .maybeSingle();

  if (!job) return NextResponse.json({ ok: true });

  await supabase.from("job_share_clicks").insert({
    job_id: job.id,
    club_id: job.club_id,
    platform,
  });

  return NextResponse.json({ ok: true });
}
