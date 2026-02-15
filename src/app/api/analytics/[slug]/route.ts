import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: club } = await admin
    .from("clubs")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (!club) {
    return NextResponse.json(
      { error: "Club not found" },
      { status: 404 }
    );
  }

  const { data: likes } = await admin
    .from("view_job_likes")
    .select("job_id, title, total_likes")
    .eq("club_id", club.id);

  const { data: clicks } = await admin
    .from("view_job_clicks")
    .select("job_id, title, total_clicks")
    .eq("club_id", club.id);

  // Combine likes + clicks by job_id
  const stats = (likes || []).map((l) => ({
    job_id: l.job_id,
    title: l.title,
    likes: l.total_likes || 0,
    clicks:
      clicks?.find((c) => c.job_id === l.job_id)?.total_clicks || 0,
  }));

  return NextResponse.json(stats);
}
