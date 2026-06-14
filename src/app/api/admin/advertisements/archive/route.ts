import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const { advertisementId } = await req.json();

  if (!advertisementId) {
    return NextResponse.json(
      { error: "advertisementId ontbreekt" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("company_advertisements")
    .update({
      status: "archived",
    })
    .eq("id", advertisementId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}