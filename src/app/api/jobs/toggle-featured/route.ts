import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  SUBSCRIPTIONS,
  type PackageKey,
} from "@/lib/subscriptions";

export async function POST(req: Request) {
  try {
    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { error: "jobId ontbreekt" },
        { status: 400 }
      );
    }

    /* ======================================================
       1️⃣ Job ophalen
    ====================================================== */

    const { data: job, error: jobError } =
      await supabaseAdmin
        .from("jobs")
        .select(
          `
          id,
          featured,
          club_id,
          archived_at,
          title,
          company_name,
          apply_url,
          company_logo_url
        `
        )
        .eq("id", jobId)
        .maybeSingle();

    if (jobError || !job) {
      return NextResponse.json(
        { error: "Vacature niet gevonden" },
        { status: 404 }
      );
    }

    // 🔒 Gearchiveerde vacatures mogen nooit featured zijn
    if (job.archived_at) {
      return NextResponse.json(
        {
          error:
            "Gearchiveerde vacatures kunnen geen advertentie zijn.",
        },
        { status: 400 }
      );
    }

    /* ======================================================
       2️⃣ Club ophalen
    ====================================================== */

    const { data: club, error: clubError } =
      await supabaseAdmin
        .from("clubs")
        .select("id, active_package, admin_override")
        .eq("id", job.club_id)
        .maybeSingle();

    if (clubError || !club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    const activePackage: PackageKey =
      club.active_package &&
      club.active_package in SUBSCRIPTIONS
        ? club.active_package
        : "basic";

    const maxAds = SUBSCRIPTIONS[activePackage].ads;

    /* ======================================================
       3️⃣ Nieuwe state bepalen
    ====================================================== */

    const newFeaturedState = !job.featured;

    /* ======================================================
       4️⃣ Limiet-check (alleen bij AAN zetten)
    ====================================================== */

    if (
      newFeaturedState &&
      !club.admin_override &&
      maxAds !== Infinity
    ) {
      const { count, error: countError } =
        await supabaseAdmin
          .from("club_ads")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("club_id", club.id)
          .eq("is_active", true)
          .is("archived_at", null);

      if (countError) {
        console.error("Count ads error:", countError);
        return NextResponse.json(
          {
            error:
              "Kon advertentie-limiet niet controleren",
          },
          { status: 500 }
        );
      }

      const currentAds = count ?? 0;

      if (currentAds >= maxAds) {
        return NextResponse.json(
          {
            error:
              "Maximum aantal advertenties bereikt in dit pakket.",
            reason: "limit_reached",
            currentAds,
            maxAds,
          },
          { status: 403 }
        );
      }
    }

    /* ======================================================
       5️⃣ Job featured togglen
    ====================================================== */

    const { error: updateError } =
      await supabaseAdmin
        .from("jobs")
        .update({ featured: newFeaturedState })
        .eq("id", job.id);

    if (updateError) {
      console.error(updateError);
      return NextResponse.json(
        { error: "Kon vacature niet updaten" },
        { status: 500 }
      );
    }

    /* ======================================================
       6️⃣ club_ads synchroniseren
    ====================================================== */

    if (newFeaturedState) {
      // ➕ Advertentie activeren

      const { data: existingAd } =
        await supabaseAdmin
          .from("club_ads")
          .select("id, archived_at")
          .eq("job_id", job.id)
          .maybeSingle();

      if (!existingAd) {
        const { error: insertError } =
          await supabaseAdmin.from("club_ads").insert({
            club_id: club.id,
            job_id: job.id,
            company_name: job.company_name,
            link_url: job.apply_url,
            image_url:
              job.company_logo_url ?? null,
            is_active: true,
            is_featured: true,
            archived_at: null,
          });

        if (insertError) {
          console.error(
            "Insert club_ad error:",
            insertError
          );
          return NextResponse.json(
            { error: "Kon advertentie niet aanmaken" },
            { status: 500 }
          );
        }
      } else {
        await supabaseAdmin
          .from("club_ads")
          .update({
            is_active: true,
            is_featured: true,
            archived_at: null,
          })
          .eq("id", existingAd.id);
      }
    } else {
      // ➖ Advertentie uitschakelen
      await supabaseAdmin
        .from("club_ads")
        .update({
          is_active: false,
          archived_at:
            new Date().toISOString(),
        })
        .eq("job_id", job.id)
        .is("archived_at", null);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(
      "toggle-featured error:",
      err
    );
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
