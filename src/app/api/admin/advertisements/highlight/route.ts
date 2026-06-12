import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: NextRequest
) {
  try {
    const {
      advertisementId,
      isFeatured,
    } = await req.json();

    const { data: advertisement } =
  await supabaseAdmin
    .from("company_advertisements")
    .select("*")
    .eq("id", advertisementId)
    .single();

await supabaseAdmin
  .from("company_advertisements")
  .update({
    is_featured: isFeatured,
  })
  .eq("id", advertisementId);

await supabaseAdmin
  .from("jobs")
  .update({
    featured: isFeatured,
  })
  .eq("club_id", advertisement.club_id)
  .eq(
    "company_name",
    advertisement.company_name
  );

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Highlight failed" },
      { status: 500 }
    );
  }
}