import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { clubId } = await req.json();

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

    if (!clubId) {
      return NextResponse.json(
        { error: "Missing clubId" },
        { status: 400 }
      );
    }

    /* ===============================
       1. Club ophalen
       =============================== */
    const { data: club, error: clubError } = await supabaseAdmin
      .from("clubs")
      .select("id, name, email, slug, status")
      .eq("id", clubId)
      .single();

    if (clubError || !club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    if (club.status !== "approved") {
  return NextResponse.json(
    {
      error: "Club is niet goedgekeurd",
    },
    { status: 400 }
  );
}

if (!club.email) {
  return NextResponse.json(
    {
      error: "Club heeft geen e-mailadres",
    },
    { status: 400 }
  );
}

    /* ===============================
       2. Login link
       =============================== */
    const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/login`;

    /* ===============================
       3. Mail naar club
       =============================== */
    const mailResult =
  await resend.emails.send({
      from: "Sponsorjobs <no-reply@sponsorjobs.nl>",
      to: [club.email],
      subject: "🎉 Je club is goedgekeurd – je kunt nu starten",
      html: `
        <h2>Welkom bij Sponsorjobs 🎉</h2>
        <p>Goed nieuws <strong>${club.name}</strong>!</p>
        <p>Je clubaccount is goedgekeurd door onze administratie.</p>

        <p>
          👉 <a href="${loginUrl}">
            Klik hier om in te loggen
          </a>
        </p>

        <p>
          Na het inloggen kom je direct in je clubdashboard
          waar je aan de slag kunt met Sponsorjobs.
        </p>

        <p>Veel succes en plezier!</p>
        <p>— Team Sponsorjobs</p>
      `,
    });

    if (mailResult.error) {
  throw new Error(
    mailResult.error.message
  );
}

await supabaseAdmin
  .from("subscription_events")
  .insert({
    club_id: clubId,
    event_type:
  "upgrade_approval_notification_sent",
  });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(
  "Notify upgrade approved error:",
  err
);
    return NextResponse.json(
  {
    error:
      "Failed to send upgrade approval mail",
  },
  { status: 500 }
);
  }
}
