import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { reportId } = await req.json();

    const { data: report } = await supabaseAdmin
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

    if (!report) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const monthName = new Date(report.month).toLocaleDateString("nl-NL", {
      month: "long",
      year: "numeric",
    });

    await resend.emails.send({
      from: "Sponsorjobs <no-reply@sponsorjobs.nl>",
      to: report.clubs.report_email,
      subject: `Maandrapport vacatures – ${monthName}`,
      html: `<p>Herzonden maandrapport voor ${monthName}</p>`,
      headers: {
        "X-Entity-Ref-ID": reportId,
      },
    });

    await supabaseAdmin
      .from("monthly_reports")
      .update({
        status: "sent",
        sent_at: new Date(),
      })
      .eq("id", reportId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Retry failed" }, { status: 500 });
  }
}
