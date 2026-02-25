// src/app/api/stripe/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

/**
 * Stripe v14+ haalt `subscription` uit Invoice typing.
 * Runtime bevat hem nog wel.
 * Daarom breiden we het type hier veilig uit.
 */
type StripeInvoiceWithSubscription = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription | null;
};

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  try {

    /* ===============================
   IDEMPOTENCY CHECK
=============================== */

const { data: existing } = await supabaseAdmin
  .from("stripe_events")
  .select("id")
  .eq("id", event.id)
  .maybeSingle();

if (existing) {
  return NextResponse.json({ received: true });
}

await supabaseAdmin
  .from("stripe_events")
  .insert({
    id: event.id,
    type: event.type,
  });

    /* ===============================
       CHECKOUT COMPLETED
    =============================== */

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const clubId = session.metadata?.club_id;
      const packageKey = session.metadata?.package_key;

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (!clubId || !packageKey || !subscriptionId) {
        return NextResponse.json({ received: true });
      }

      const subscription =
        await stripe.subscriptions.retrieve(subscriptionId);

      const item = subscription.items.data[0];
      if (!item) return NextResponse.json({ received: true });

      await supabaseAdmin
        .from("clubs")
        .update({
          active_package: packageKey,
          subscription_status: subscription.status,
          subscription_start: new Date(
            item.current_period_start * 1000
          ).toISOString(),
          subscription_end: new Date(
            item.current_period_end * 1000
          ).toISOString(),
          stripe_subscription_id: subscriptionId,
        })
        .eq("id", clubId);
    }

    /* ===============================
       PAYMENT FAILED
    =============================== */

    if (event.type === "invoice.payment_failed") {
      const invoice =
        event.data.object as StripeInvoiceWithSubscription;

      const subscriptionId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id;

      if (!subscriptionId) return NextResponse.json({ received: true });

      await supabaseAdmin
        .from("clubs")
        .update({
          subscription_status: "past_due",
        })
        .eq("stripe_subscription_id", subscriptionId);
    }

    /* ===============================
       PAYMENT SUCCEEDED
    =============================== */

    if (event.type === "invoice.payment_succeeded") {
      const invoice =
        event.data.object as StripeInvoiceWithSubscription;

      const subscriptionId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id;

      if (!subscriptionId) return NextResponse.json({ received: true });

      await supabaseAdmin
        .from("clubs")
        .update({
          subscription_status: "active",
        })
        .eq("stripe_subscription_id", subscriptionId);
    }

    /* ===============================
       SUBSCRIPTION UPDATED
    =============================== */

    if (event.type === "customer.subscription.updated") {
      const subscription =
        event.data.object as Stripe.Subscription;

      const item = subscription.items.data[0];
      if (!item) return NextResponse.json({ received: true });

      await supabaseAdmin
        .from("clubs")
        .update({
          subscription_status: subscription.status,
          subscription_start: new Date(
            item.current_period_start * 1000
          ).toISOString(),
          subscription_end: new Date(
            item.current_period_end * 1000
          ).toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);
    }

    /* ===============================
       SUBSCRIPTION DELETED
    =============================== */

    if (event.type === "customer.subscription.deleted") {
      const subscription =
        event.data.object as Stripe.Subscription;

      await supabaseAdmin
        .from("clubs")
        .update({
          active_package: "basic",
          subscription_status: "cancelled",
          stripe_subscription_id: null,
        })
        .eq("stripe_subscription_id", subscription.id);
    }

  } catch (err) {
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}