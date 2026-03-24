import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { job_id, platform } = await req.json();

  if (!job_id || !platform) {
    return NextResponse.json({ ok: false });
  }

  const { error } = await supabaseAdmin
    .from("job_shares")
    .insert({
      job_id,
      platform,
    });

  if (error) {
    console.error("❌ share insert error:", error);
  }

  return NextResponse.json({ ok: true });
}