// src/app/api/stripe/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // 🔥 TOEVOEGEN

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

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

  const rawBody = await req.text(); // 🔥 BELANGRIJK

let event: Stripe.Event;

try {
  event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
} catch (err) {
  console.error("❌ Webhook signature error:", err);
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

    /* ===============================
       CHECKOUT COMPLETED
    =============================== */

    if (event.type === "checkout.session.completed") {
  console.log("🔥 EVENT:", event.type);

const session = event.data.object as Stripe.Checkout.Session;

/* ===============================
   ADVERTISEMENT PURCHASE
=============================== */

if (
  session.metadata?.type ===
  "advertisement_purchase"
) {

  const leadId = session.metadata?.lead_id;

  if (!leadId) {
    console.error("❌ Missing lead_id");
    return NextResponse.json({ received: true });
  }

  const { data: lead } =
    await supabaseAdmin
      .from("advertisement_leads")
      .select("*")
      .eq("id", leadId)
      .single();

  if (!lead) {
    console.error("❌ Lead not found");
    return NextResponse.json({ received: true });
  }

  if (lead.status === "paid") {
  console.log(
    "⚠️ Advertisement already processed"
  );

  return NextResponse.json({
    received: true,
  });
}

  const clubIds = lead.club_ids as string[];

  const packagePrices = {
    partner: 350,
    spotlight: 750,
    premium: 1250,
  };

  const packagePrice =
  packagePrices[
    lead.package_key as keyof typeof packagePrices
  ];

if (!packagePrice) {
  console.error(
    "❌ Invalid package key:",
    lead.package_key
  );

  return NextResponse.json({
    received: true,
  });
}
const packageNames = {
  partner: "Partner",
  spotlight: "Spotlight",
  premium: "Premium",
};

const packageName =
  packageNames[
    lead.package_key as keyof typeof packageNames
  ];

const { data: packageData } =
  await supabaseAdmin
    .from("advertisement_packages")
    .select("id")
    .eq("name", packageName)
    .single();

if (!packageData) {
  console.error(
    "❌ Package not found:",
    packageName
  );

  return NextResponse.json({
    received: true,
  });
}

  for (const clubId of clubIds) {

    const clubAmount =
      Math.round(packagePrice * 0.7);

      const { data: clubData } =
  await supabaseAdmin
    .from("clubs")
    .select("name,email")
    .eq("id", clubId)
    .single();

    const platformAmount =
      Math.round(packagePrice * 0.3);

    const startDate =
      new Date();

    const endDate =
      new Date();

    endDate.setFullYear(
      endDate.getFullYear() + 1
    );

    const {
  data: order,
  error: orderError,
} =
  await supabaseAdmin
    .from("advertisement_orders")
    .insert({
      club_id: clubId,

      company_name:
        lead.company_name,

      company_email:
        lead.company_email,

      packageName:
  packageName,

      amount:
        packagePrice,

      club_amount:
        clubAmount,

      platform_amount:
        platformAmount,

      stripe_checkout_session_id:
        session.id,

      stripe_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,

      start_date:
        startDate.toISOString(),

      end_date:
        endDate.toISOString(),

      status: "paid",
    })
    .select()
    .single();

if (orderError) {
  console.error(
    "❌ ORDER INSERT ERROR:",
    orderError
  );
}

console.log(
  "🔥 ORDER RESULT:",
  order
);

console.log(
  "🔥 ORDER ID:",
  order?.id
);

    await supabaseAdmin
  .from("company_advertisements")
  .insert({
    club_id: clubId,

    company_name:
      lead.company_name,

    company_email:
      lead.company_email,

    company_website:
      lead.company_website,

    vacancy_url:
      lead.vacancy_url,

    package_id: packageData.id,

    order_id:
      order?.id,

    start_date:
      startDate.toISOString(),

    end_date:
      endDate.toISOString(),

    status:
      "pending_activation",
  });

/* ===============================
   CLUB MAIL
=============================== */

if (clubData?.email) {
  await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        type:
          "club_advertisement_sold",

        clubEmail:
          clubData.email,

        companyName:
          lead.company_name,

        vacancyUrl:
          lead.vacancy_url,

        packageName:
          lead.package_key,

        clubRevenue:
          clubAmount,
      }),
    }
  );
}

} // <-- einde for-loop
  

  await supabaseAdmin
  .from("advertisement_leads")
  .update({
    status: "paid",
  })
  .eq("id", lead.id);

  const { data: clubs } =
  await supabaseAdmin
    .from("clubs")
    .select("name")
    .in("id", clubIds);

const clubNames =
  clubs?.map((c) => c.name) || [];

  await fetch(
  `${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      type: "advertisement_sold",

      companyName:
        lead.company_name,

      contactName:
        lead.contact_name,

      companyEmail:
        lead.company_email,

      companyWebsite:
        lead.company_website,

      vacancyUrl:
        lead.vacancy_url,

      packageName:
        lead.package_key,

      clubs:
        clubNames,
    }),
  }
);

await fetch(
  `${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      type:
        "advertisement_confirmation",

      companyEmail:
        lead.company_email,

      contactName:
        lead.contact_name,
    }),
  }
);

/* ===============================
   MAILS
=============================== */

// komt hier

console.log(
  "✅ Advertisement purchase verwerkt"
);

return NextResponse.json({
  received: true,
});

}

/* ===============================
   🔥 EXTRA ADS CHECK
=============================== */

const extraAdsPriceId = process.env.STRIPE_PRICE_AD_EXTRA;

const lineItems = await stripe.checkout.sessions.listLineItems(
  session.id
);

let extraAdsPurchased = 0;

lineItems.data.forEach((item) => {
  if (item.price?.id === extraAdsPriceId) {
    extraAdsPurchased += item.quantity ?? 0;
  }
});

/* ===============================
   EXTRA ADS FLOW
=============================== */

if (extraAdsPurchased > 0) {
  const clubId = session.metadata?.club_id;

  if (!clubId) {
    console.error("❌ Missing club_id for extra ads");
    return NextResponse.json({ received: true });
  }

  console.log("🔥 EXTRA ADS GEKOCHT:", extraAdsPurchased);

  const { data: clubData } = await supabaseAdmin
    .from("clubs")
    .select("extra_ads")
    .eq("id", clubId)
    .single();

  const currentExtraAds = clubData?.extra_ads ?? 0;
  const newTotal = currentExtraAds + extraAdsPurchased;

  if (newTotal > 10) {
    console.log("⚠️ Max ads overschreden");
    return NextResponse.json({ received: true });
  }

  await supabaseAdmin
    .from("clubs")
    .update({
      extra_ads: newTotal,
    })
    .eq("id", clubId);

  // 🔥 STOP → NIET door naar abonnement flow
  return NextResponse.json({ received: true });
}

const clubId = session.metadata?.club_id;

console.log("🔥 CLUB ID:", clubId);
console.log("🔥 METADATA:", session.metadata);

  if (!clubId) return NextResponse.json({ received: true });

  const subscriptionId =
  typeof session.subscription === "string"
    ? session.subscription
    : session.subscription?.id ?? null;

  if (!subscriptionId) return NextResponse.json({ received: true });

  const subscription =
    await stripe.subscriptions.retrieve(subscriptionId);

  const item = subscription.items.data[0];
  if (!item) return NextResponse.json({ received: true });

const packageKey = session.metadata?.package_key;

console.log("🔥 PACKAGE KEY:", packageKey);

if (!packageKey) {
  console.error("❌ Missing package_key in metadata");
  return NextResponse.json({ received: true });
}

  await supabaseAdmin
  .from("clubs")
  .update({
    active_package: packageKey,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string, // 👈 toevoegen
    subscription_status: subscription.status,
    billing_status:
      subscription.status === "active"
        ? "active"
        : subscription.status,
    subscription_start: new Date(
      item.current_period_start * 1000
    ).toISOString(),
    subscription_end: new Date(
      item.current_period_end * 1000
    ).toISOString(),
    payment_failed_at: null,
  })
  .eq("id", clubId);
}

    /* ===============================
       PAYMENT FAILED
    =============================== */

    if (event.type === "invoice.payment_failed") {
  const invoice = event.data.object as StripeInvoiceWithSubscription;

  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription?.id;

  if (!subscriptionId) return NextResponse.json({ received: true });

  await supabaseAdmin
    .from("clubs")
    .update({
      subscription_status: "past_due",
      billing_status: "past_due",
      payment_failed_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId);
}

    /* ===============================
       PAYMENT SUCCEEDED
    =============================== */

    if (event.type === "invoice.payment_succeeded") {
  const invoice = event.data.object as StripeInvoiceWithSubscription;

  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription?.id;

  if (!subscriptionId) return NextResponse.json({ received: true });

  await supabaseAdmin
    .from("clubs")
    .update({
      subscription_status: "active",
      billing_status: "active",
      payment_failed_at: null,
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

  const cancelDate = subscription.cancel_at
    ? new Date(subscription.cancel_at * 1000).toISOString()
    : null;

  await supabaseAdmin
    .from("clubs")
    .update({
      subscription_status: subscription.status,
      billing_status:
        subscription.status === "active"
          ? "active"
          : subscription.status,
      subscription_start: new Date(
        item.current_period_start * 1000
      ).toISOString(),
      subscription_end: new Date(
        item.current_period_end * 1000
      ).toISOString(),

      // 🔥 NIEUW
      subscription_cancelled_at: cancelDate,
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
    billing_status: "canceled",
    stripe_subscription_id: null,
    deleted_at: new Date().toISOString(), // 🔥 TOEVOEGEN
  })
  .eq("stripe_subscription_id", subscription.id);
    }

  } catch (err) {
  console.error(
    "❌ WEBHOOK ERROR:",
    err
  );

  return NextResponse.json(
    { error: "Webhook handler failed" },
    { status: 500 }
  );
}

  await supabaseAdmin
  .from("stripe_events")
  .upsert({
    id: event.id,
    type: event.type,
    payload: event,
  });

  return NextResponse.json({ received: true });
}