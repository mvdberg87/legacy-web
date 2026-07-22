import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

const packagePrices = {
  partner: 350,
  spotlight: 750,
  premium: 1250,
};

export async function POST(req: NextRequest) {

  try {

    const {
  campaigns,

  companyName,
  contactName,
  companyEmail,
  companyWebsite,
  vacancyUrl,
  phoneNumber,
  notes,
} = await req.json();

    let amount = 0;

for (const campaign of campaigns) {
  const price =
    packagePrices[
      campaign.packageKey as keyof typeof packagePrices
    ];

  if (!price) {
    return NextResponse.json(
      { error: "Invalid package" },
      { status: 400 }
    );
  }

  amount += price * campaign.quantity;
}

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

      campaigns,

      status: "checkout_pending",
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
  `Sponsorjobs Recruitmentcampagne (${campaigns.length} campagne(s))`,
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