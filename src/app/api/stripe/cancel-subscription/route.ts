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

    // 🔥 haal subscription id op uit DB
    const { data: club } = await supabaseAdmin
      .from("clubs")
      .select("stripe_subscription_id")
      .eq("id", clubId)
      .single();

    if (!club?.stripe_subscription_id) {
      return NextResponse.json(
        { error: "Geen subscription gevonden" },
        { status: 400 }
      );
    }

    // 🔥 cancel op einde periode (NIET direct!)
    const subscription = await stripe.subscriptions.update(
      club.stripe_subscription_id,
      {
        cancel_at_period_end: true,
      }
    );

    // 🔥 sla einddatum op
    const sub = subscription as any;

const cancelDate = sub.current_period_end
  ? new Date(sub.current_period_end * 1000).toISOString()
  : null;

    await supabaseAdmin
  .from("clubs")
  .update({
    subscription_cancelled_at: cancelDate,
  })
      .eq("id", clubId);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Cancel failed" },
      { status: 500 }
    );
  }
}