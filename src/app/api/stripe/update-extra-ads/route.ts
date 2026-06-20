import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createServerClient } from "@supabase/ssr";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { clubId, quantity } = await req.json();

    if (!clubId || quantity === undefined) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name) {
        return req.cookies.get(name)?.value;
      },
    },
  }
);

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

const { data: profile } = await supabaseAdmin
  .from("profiles")
  .select("club_id, role")
  .eq("user_id", user.id)
  .single();

if (!profile) {
  return NextResponse.json(
    { error: "No profile" },
    { status: 403 }
  );
}

const isAdmin = profile.role === "admin";

if (!isAdmin && profile.club_id !== clubId) {
  return NextResponse.json(
    { error: "Forbidden" },
    { status: 403 }
  );
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

