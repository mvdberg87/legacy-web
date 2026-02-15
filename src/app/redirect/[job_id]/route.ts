import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 🧩 Supabase client server-side
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ job_id: string }> }
) {
  const { job_id } = await params;

  try {
    // 1️⃣ Zoek de sponsorvacature
    const { data: job, error: jobErr } = await supabase
      .from("sponsor_jobs")
      .select("job_url")
      .eq("id", job_id)
      .maybeSingle();

    if (jobErr || !job?.job_url) {
      console.error(
        "❌ Vacature niet gevonden:",
        jobErr?.message
      );
      return NextResponse.json(
        { error: "Vacature niet gevonden" },
        { status: 404 }
      );
    }

    // 2️⃣ Log de klik
    const ip =
      req.headers.get("x-forwarded-for") ?? "unknown";
    const userAgent =
      req.headers.get("user-agent") ?? "unknown";

    await supabase.from("job_clicks").insert({
      job_id,
      ip_address: ip,
      user_agent: userAgent,
    });

    // 3️⃣ Redirect naar de echte vacature
    return NextResponse.redirect(job.job_url, 302);
  } catch (err) {
    console.error("💥 Redirect-fout:", err);
    return NextResponse.json(
      { error: "Onverwachte fout" },
      { status: 500 }
    );
  }
}
