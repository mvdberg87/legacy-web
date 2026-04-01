import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { clubId, quantity, email, slug } = await req.json();

    if (!clubId || !quantity || !email || !slug) {
  return NextResponse.json(
    { error: "Missing data" },
    { status: 400 }
  );
}


    const session = await stripe.checkout.sessions.create({
  mode: "subscription", // 🔥 FIX

      customer_email: email,

      metadata: {
  club_id: clubId, // 🔥 EXACT deze naam
},

      line_items: [
        {
          price: process.env.STRIPE_PRICE_AD_EXTRA!,
          quantity,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/club/${slug}/dashboard?extra_ads=success`,
cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/club/${slug}/dashboard`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}