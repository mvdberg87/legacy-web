import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase.server";

export async function POST(req: Request) {
  const { job_id, company_website } = await req.json();

  if (!job_id || !company_website) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    const domain = new URL(company_website).hostname.replace(/^www\./, "");
const logoUrl = `https://logo.clearbit.com/${domain}`;

    const supabase = await getSupabaseServer();

    const { error } = await supabase
      .from("jobs")
      .update({ company_logo_url: logoUrl })
      .eq("id", job_id)
      .is("company_logo_url", null); // cache only once

    if (error) {
      console.error("❌ Logo cache error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
}
