import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: NextRequest
) {
  try {

    const {
  advertisementId,
  jobTitle,
  companyName,
  vacancyUrl,
  packageName,
} = await req.json();

    /* ===============================
   Advertentie updaten
=============================== */

await supabaseAdmin
  .from("company_advertisements")
  .update({
    job_title: jobTitle,
    company_name: companyName,
    vacancy_url: vacancyUrl,
  })
  .eq("id", advertisementId);

/* ===============================
   Order ophalen
=============================== */

const { data: advertisement } =
  await supabaseAdmin
    .from("company_advertisements")
    .select("order_id")
    .eq("id", advertisementId)
    .single();

/* ===============================
   Nieuwe pakketprijzen
=============================== */

const packagePrices = {
  partner: 350,
  spotlight: 750,
  premium: 1250,
};

const amount =
  packagePrices[
    packageName as keyof typeof packagePrices
  ];

const clubAmount =
  Math.round(amount * 0.7);

const platformAmount =
  Math.round(amount * 0.3);

/* ===============================
   Order updaten
=============================== */

if (advertisement?.order_id) {
  await supabaseAdmin
    .from("advertisement_orders")
    .update({
      package_name: packageName,
      amount,
      club_amount: clubAmount,
      platform_amount: platformAmount,
    })
    .eq(
      "id",
      advertisement.order_id
    );
}

    return NextResponse.json({
  success: true,
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