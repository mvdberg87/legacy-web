import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: NextRequest
) {

  const {
    advertisementId,
    rejectionReason,
  } = await req.json();

  await supabaseAdmin
    .from("company_advertisements")
    .update({
      status: "rejected",
      rejection_reason:
        rejectionReason,
    })
    .eq("id", advertisementId);

  return NextResponse.json({
    success: true,
  });
}