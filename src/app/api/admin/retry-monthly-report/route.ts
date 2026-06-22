import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";
import { createServerClient } from "@supabase/ssr";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { reportId } = await req.json();

    if (!reportId) {
  return NextResponse.json(
    { error: "Missing reportId" },
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

    const {
  data: report,
  error: reportError,
} = await supabaseAdmin
  .from("monthly_reports")
  .select(`
    *,
    clubs (
      name,
      slug,
      report_email
    )
  `)
  .eq("id", reportId)
  .single();

if (reportError) {
  throw reportError;
}

    if (!report) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!report.clubs?.report_email) {
  return NextResponse.json(
    {
      error:
        "Geen rapport e-mailadres ingesteld",
    },
    { status: 400 }
  );
}

    const monthName = new Date(report.month).toLocaleDateString("nl-NL", {
      month: "long",
      year: "numeric",
    });

    const mailResult =
  await resend.emails.send({
      from: "Sponsorjobs <no-reply@sponsorjobs.nl>",
      to: report.clubs.report_email,
      subject: `Maandrapport vacatures – ${monthName}`,
      html: `<p>Herzonden maandrapport voor ${monthName}</p>`,
      headers: {
        "X-Entity-Ref-ID": reportId,
      },
    });

    if (mailResult.error) {
  throw new Error(
    mailResult.error.message
  );
}

    await supabaseAdmin
      .from("monthly_reports")
      .update({
        status: "sent",
        sent_at: new Date(),
      })
      .eq("id", reportId);

      await supabaseAdmin
  .from("subscription_events")
  .insert({
    club_id: report.club_id,
    event_type:
      "monthly_report_resent",
  });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Retry failed" }, { status: 500 });
  }
}
