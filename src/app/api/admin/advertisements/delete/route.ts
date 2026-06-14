import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: NextRequest
) {
  try {
    const {
      advertisementId,
    } = await req.json();

    await supabaseAdmin
      .from("company_advertisements")
      .update({
        status: "archived"
      })
      .eq("id", advertisementId);

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}