// src/app/api/stripe/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("❌ Missing Stripe signature");
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
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
    console.error("❌ Webhook verification failed:", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  /* ===============================
     ✅ Checkout completed
     =============================== */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const clubId = session.metadata?.club_id;
    const packageKey = session.metadata?.package_key;

    console.log("🔔 Stripe checkout completed", {
      clubId,
      packageKey,
      sessionId: session.id,
    });

    if (!clubId || !packageKey) {
      console.error(
        "❌ Missing club_id or package_key in session metadata"
      );
      return NextResponse.json({ received: true });
    }

    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    /* ===============================
       1️⃣ Club activeren
       =============================== */
    const { error: clubError } = await supabaseAdmin
      .from("clubs")
      .update({
        active_package: packageKey,
        pending_package: null,
        subscription_status: "active",
        subscription_start: now.toISOString(),
        subscription_end: nextMonth.toISOString(),
      })
      .eq("id", clubId);

    if (clubError) {
      console.error(
        "❌ Failed updating club subscription:",
        clubError
      );
    }

    /* ===============================
       2️⃣ Upgrade request afronden
       =============================== */
    const { error: upgradeError } = await supabaseAdmin
      .from("club_upgrade_requests")
      .update({
        status: "completed",
        completed_at: now.toISOString(),
      })
      .eq("club_id", clubId)
      .in("status", ["pending", "approved"]);

    if (upgradeError) {
      console.error(
        "❌ Failed updating upgrade request:",
        upgradeError
      );
    }

    console.log(
      `✅ Subscription activated for club ${clubId} → ${packageKey}`
    );
  }

  return NextResponse.json({ received: true });
}
