import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: NextRequest
) {
  try {

    const {
      advertisementId,
      autoRenew,
    } = await req.json();

    console.log(
  "TOGGLE RENEWAL:",
  advertisementId,
  autoRenew
);

    const result =
  await supabaseAdmin
    .from("company_advertisements")
    .update({
      auto_renew: autoRenew,
    })
    .eq(
      "id",
      advertisementId
    )
    .select();

console.log(
  "TOGGLE RESULT:",
  result
);

    return NextResponse.json({
      success: true,
    });

  } catch {

    return NextResponse.json(
      {
        error: "Update failed",
      },
      {
        status: 500,
      }
    );
  }
}