import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { error: "jobId ontbreekt" },
        { status: 400 }
      );
    }

    // Eerst gekoppelde advertenties verwijderen
    const { error: adsError } = await supabase
      .from("club_ads")
      .delete()
      .eq("job_id", jobId);

    if (adsError) {
      return NextResponse.json(
        { error: adsError.message },
        { status: 500 }
      );
    }

    // Daarna vacature verwijderen
    const { error: jobError } = await supabase
      .from("jobs")
      .delete()
      .eq("id", jobId);

    if (jobError) {
      return NextResponse.json(
        { error: jobError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message ?? "Onbekende fout",
      },
      { status: 500 }
    );
  }
}