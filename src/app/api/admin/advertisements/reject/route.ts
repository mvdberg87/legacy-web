import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: NextRequest
) {

  const {
    advertisementId,
    rejectionReason,
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
      status: "rejected",
      rejection_reason:
        rejectionReason,
    })
    .eq("id", advertisementId);

    await fetch(
  `${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`,
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({
      type:
        "advertisement_rejected",

      companyEmail:
        advertisement?.company_email,

      companyName:
        advertisement?.company_name,

      reason:
        rejectionReason,
    }),
  }
);

  return NextResponse.json({
    success: true,
  });
}