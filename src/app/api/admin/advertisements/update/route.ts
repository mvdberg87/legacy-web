import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: NextRequest
) {
  try {

    const {
      advertisementId,
      companyName,
      companyWebsite,
      vacancyUrl,
    } = await req.json();

    await supabaseAdmin
      .from("company_advertisements")
      .update({
        company_name:
          companyName,

        company_website:
          companyWebsite,

        vacancy_url:
          vacancyUrl,

        updated_at:
          new Date().toISOString(),
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
        error:
          "Update failed",
      },
      {
        status: 500,
      }
    );
  }
}