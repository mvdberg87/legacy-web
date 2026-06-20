import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { error: "jobId ontbreekt" },
        { status: 400 }
      );
    }

    /* ===============================
   ADMIN AUTH CHECK
=============================== */

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name) {
        return req.cookies.get(name)?.value;
      },
    },
  }
);

const {
  data: { user: adminUser },
} = await supabase.auth.getUser();

if (!adminUser) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

const {
  data: profile,
  error: profileError,
} = await supabaseAdmin
  .from("profiles")
  .select("role")
  .eq("user_id", adminUser.id)
  .single();

if (
  profileError ||
  !profile ||
  profile.role !== "admin"
) {
  return NextResponse.json(
    { error: "Admin only" },
    { status: 403 }
  );
}

const { data: job } = await supabaseAdmin
  .from("jobs")
  .select("id, club_id")
  .eq("id", jobId)
  .maybeSingle();

if (!job) {
  return NextResponse.json(
    { error: "Vacature niet gevonden" },
    { status: 404 }
  );
}

    // Eerst gekoppelde advertenties archiveren
const { error: adsError } = await supabaseAdmin
  .from("club_ads")
  .update({
    archived_at: new Date().toISOString(),
    is_active: false,
  })
  .eq("job_id", jobId);

if (adsError) {
  return NextResponse.json(
    { error: adsError.message },
    { status: 500 }
  );
}

// Daarna vacature archiveren
const { error: jobError } = await supabaseAdmin
  .from("jobs")
  .update({
    archived_at: new Date().toISOString(),
    is_active: false,
  })
  .eq("id", jobId);

    if (jobError) {
      return NextResponse.json(
        { error: jobError.message },
        { status: 500 }
      );
    }

    await supabaseAdmin
  .from("subscription_events")
  .insert({
    club_id: job.club_id,
    event_type: "job_deleted",
  });

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