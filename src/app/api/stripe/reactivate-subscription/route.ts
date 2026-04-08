import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { clubId } = await req.json();

    if (!clubId) {
      return NextResponse.json(
        { error: "Missing clubId" },
        { status: 400 }
      );
    }

    const { data: club } = await supabaseAdmin
      .from("clubs")
      .select("stripe_subscription_id, subscription_cancelled_at")
      .eq("id", clubId)
      .single();

      // ❗ check: is er überhaupt een opzegging?
if (!club?.subscription_cancelled_at) {
  return NextResponse.json(
    { error: "Abonnement is niet opgezegd" },
    { status: 400 }
  );
}

    if (!club?.stripe_subscription_id) {
      return NextResponse.json(
        { error: "Geen subscription gevonden" },
        { status: 400 }
      );
    }

    // 🔥 Reactiveren in Stripe
    await stripe.subscriptions.update(
      club.stripe_subscription_id,
      {
        cancel_at_period_end: false,
      }
    );

    await supabaseAdmin
  .from("clubs")
  .update({
    subscription_cancelled_at: null,
    deleted_at: null, // 🔥 HEEL BELANGRIJK
    subscription_status: "active", // 👈 extra zekerheid
  })
  .eq("id", clubId);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Reactivate failed" },
      { status: 500 }
    );
  }
}