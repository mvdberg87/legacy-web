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

    await supabaseAdmin
      .from("company_advertisements")
      .update({
        auto_renew: autoRenew,
      })
      .eq(
        "id",
        advertisementId
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