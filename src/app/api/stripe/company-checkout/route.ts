import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!,
  {
    apiVersion: "2025-12-15.clover",
  }
);

const packagePrices = {
  partner: 350,
  spotlight: 750,
  premium: 1250,
};

export async function POST(req: NextRequest) {

  try {

    const {
      clubIds,
      packageKey,

      companyName,
      contactName,
      companyEmail,
      companyWebsite,
      vacancyUrl,
      phoneNumber,
      notes,
    } = await req.json();

    const packagePrice =
  packagePrices[
    packageKey as keyof typeof packagePrices
  ];

if (!packagePrice) {
  return NextResponse.json(
    { error: "Invalid package" },
    { status: 400 }
  );
}

const amount =
  packagePrice * clubIds.length;

  const packageName =
  packageKey.charAt(0).toUpperCase() +
  packageKey.slice(1);

const { data: packageData } =
  await supabaseAdmin
    .from("advertisement_packages")
    .select("id")
    .eq("name", packageName)
    .single();

      const { data: lead, error: leadError } =
  await supabaseAdmin
    .from("advertisement_leads")
    .insert({
      company_name: companyName,
      contact_name: contactName,
      company_email: companyEmail,
      company_website: companyWebsite,
      vacancy_url: vacancyUrl,
      phone_number: phoneNumber || null,
      notes: notes || null,
      package_key: packageKey,
      club_ids: clubIds,
      status: "checkout_pending",
      package_id: packageData?.id,
    })
    .select()
    .single();

if (leadError || !lead) {
  console.error(leadError);

  return NextResponse.json(
    { error: "Lead creation failed" },
    { status: 500 }
  );
}

    const session =
      await stripe.checkout.sessions.create({

        mode: "payment",

        customer_email: companyEmail,

        line_items: [
          {
            price_data: {
              currency: "eur",

              product_data: {
  name:
    `${packageKey.toUpperCase()} Recruitment Campagne`,
},

              unit_amount:
                amount * 100,
            },

            quantity: 1,
          },
        ],

        metadata: {
  type: "advertisement_purchase",
  lead_id: lead.id,
},

        success_url:
          `${process.env.NEXT_PUBLIC_SITE_URL}/bedrijven?success=true`,

        cancel_url:
          `${process.env.NEXT_PUBLIC_SITE_URL}/bedrijven`,
      });

      await supabaseAdmin
  .from("advertisement_leads")
  .update({
    stripe_session_id: session.id,
  })
  .eq("id", lead.id);

    return NextResponse.json({
      url: session.url,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}