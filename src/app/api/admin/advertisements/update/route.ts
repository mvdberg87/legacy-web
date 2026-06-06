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
  packageName,
} = await req.json();

    console.log("UPDATE REQUEST:", {
      advertisementId,
      companyName,
      companyWebsite,
      vacancyUrl,
    });

    const result =
      await supabaseAdmin
        .from("company_advertisements")
        .update({
  company_name: companyName,
  company_website: companyWebsite,
  vacancy_url: vacancyUrl,
  package_name: packageName,
})
        .eq("id", advertisementId)
        .select();

    console.log(
      "UPDATE RESULT:",
      result
    );

    return NextResponse.json({
      success: true,
      result,
    });

  } catch (error) {

    console.error(
      "UPDATE ERROR:",
      error
    );

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