import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { clubId, reason } = await req.json();

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

    const subscription = await stripe.subscriptions.update(
  club.stripe_subscription_id,
  {
    cancel_at_period_end: true,
  }
) as unknown as Stripe.Subscription;

const currentPeriodEnd =
  subscription.items.data[0]?.current_period_end;

const cancelDate = currentPeriodEnd
  ? new Date(currentPeriodEnd * 1000).toISOString()
  : null;

// 👇 daarna blijft alles hetzelfde
await supabaseAdmin
  .from("clubs")
  .update({
    subscription_cancelled_at: cancelDate,
    cancel_reason: reason,
  })
  .eq("id", clubId);

  // 🔥 club info + email ophalen
const { data: clubInfo } = await supabaseAdmin
  .from("clubs")
  .select(`
    name,
    profiles (
      email
    )
  `)
  .eq("id", clubId)
  .single();

const clubEmail = clubInfo?.profiles?.[0]?.email;

      // 📩 MAILS VERSTUREN (veilig)
try {
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "subscription_cancelled",
      clubId,
      clubName: clubInfo?.name,
      clubEmail,
      endDate: cancelDate,
      reason,
    }),
  });

  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "admin_subscription_cancelled",
      clubId,
      clubName: clubInfo?.name,
      endDate: cancelDate,
      reason,
    }),
  });

} catch (mailErr) {
  console.error("Mail error:", mailErr);
}

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Cancel failed" },
      { status: 500 }
    );
  }
}