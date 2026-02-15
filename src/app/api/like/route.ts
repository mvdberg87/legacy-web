// src/app/api/like/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ✅ Route om likes op te slaan via Postgres function (increment_job_like)
// met fallback naar directe insert als de RPC niet bestaat of faalt.

export async function POST(req: Request) {
  try {
    const { slug, jobId } = await req.json();

    if (!slug || !jobId) {
      return NextResponse.json(
        { error: "Missing slug or jobId" },
        { status: 400 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE;

    if (!url || !serviceKey) {
      console.error("❌ Missing Supabase environment variables");
      return NextResponse.json(
        { error: "Server misconfigured: missing Supabase keys" },
        { status: 500 }
      );
    }

    // ✅ Server-side Supabase client
    const admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // ✅ Probeer eerst via RPC-functie
    const { error: rpcError } = await admin.rpc("increment_job_like", {
      p_slug: slug,
      p_job_id: jobId,
    });

    if (rpcError) {
      console.warn("⚠️ RPC failed, fallback to manual insert:", rpcError.message);

      // Fallback: handmatig insert uitvoeren
      const { data: club, error: clubError } = await admin
        .from("clubs")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (clubError) {
        console.error("❌ Club fetch error:", clubError.message);
        return NextResponse.json(
          { error: clubError.message },
          { status: 500 }
        );
      }

      if (!club) {
        return NextResponse.json({ error: "Club not found" }, { status: 404 });
      }

      const { error: insertError } = await admin
        .from("likes")
        .insert({ job_id: jobId, club_id: club.id });

      if (insertError) {
        console.error("❌ Insert like error:", insertError.message);
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
    }

    // ✅ Alles goed gegaan
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("/api/like error", e);
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
