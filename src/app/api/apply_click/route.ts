import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { jobId, slug } = await req.json();

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

  if (club) {
    await admin.from("apply_clicks").insert({
      job_id: jobId,
      club_id: club.id,
    });
  }

  return NextResponse.json({ ok: true });
}
