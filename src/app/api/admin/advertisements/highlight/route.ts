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