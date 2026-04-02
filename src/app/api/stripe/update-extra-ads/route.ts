import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { clubId, quantity } = await req.json();

    if (!clubId || quantity === undefined) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. club ophalen
    const { data: club } = await supabaseAdmin
      .from("clubs")
      .select("stripe_subscription_id")
      .eq("id", clubId)
      .single();

    if (!club?.stripe_subscription_id) {
      return NextResponse.json({ error: "No subscription" }, { status: 400 });
    }

    // 2. subscription ophalen
    const subscription = await stripe.subscriptions.retrieve(
      club.stripe_subscription_id
    );

    const extraAdsPrice = process.env.STRIPE_PRICE_AD_EXTRA!;

    // 3. bestaand item zoeken
    const existingItem = subscription.items.data.find(
      (item) => item.price.id === extraAdsPrice
    );

    if (existingItem) {
      // update quantity
      await stripe.subscriptionItems.update(existingItem.id, {
  quantity,
  proration_behavior: "none", // 🔥 CRUCIAAL
});
    } else {
      // toevoegen als nieuw item
      await stripe.subscriptionItems.create({
  subscription: subscription.id,
  price: extraAdsPrice,
  quantity,
  proration_behavior: "none", // 🔥 CRUCIAAL
});
    }

    // 4. Supabase sync
    await supabaseAdmin
      .from("clubs")
      .update({ extra_ads: quantity })
      .eq("id", clubId);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}