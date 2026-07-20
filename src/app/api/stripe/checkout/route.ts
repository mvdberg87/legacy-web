import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { AGREEMENT_VERSION } from "@/lib/constants";

const PRICE_IDS = {
  basic: process.env.STRIPE_PRICE_BASIC!,
  plus: process.env.STRIPE_PRICE_PLUS!,
  pro: process.env.STRIPE_PRICE_PRO!,
  unlimited: process.env.STRIPE_PRICE_UNLIMITED!,
};

export async function POST(req: Request) {
  const {
    clubId,
    clubSlug,
    email,
    agreementAccepted,
  } = await req.json();

  if (!agreementAccepted) {
    return new Response("Agreement required", { status: 400 });
  }

  const { data: club } = await supabaseAdmin
    .from("clubs")
    .select(
      "stripe_customer_id, stripe_subscription_id, agreement_accepted, current_plan"
    )
    .eq("id", clubId)
    .maybeSingle();

  if (club?.stripe_subscription_id) {
    return new Response("Subscription already exists", {
      status: 400,
    });
  }

  let customerId = club?.stripe_customer_id;

  const packageKey = club?.current_plan;

  if (!packageKey) {
    return new Response("No package selected", {
      status: 400,
    });
  }

  const priceId =
    PRICE_IDS[packageKey as keyof typeof PRICE_IDS];

  if (!priceId) {
    return new Response("Invalid package", {
      status: 400,
    });
  }

  /* ===============================
     2️⃣ Agreement opslaan
  =============================== */

  await supabaseAdmin
    .from("clubs")
    .update({
      agreement_accepted: true,
      agreement_accepted_at: new Date().toISOString(),
      agreement_version: AGREEMENT_VERSION,
    })
    .eq("id", clubId);

  /* ===============================
     3️⃣ Maak customer als niet bestaat
  =============================== */

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: email || undefined,
      metadata: {
        club_id: String(clubId),
      },
    });

    customerId = customer.id;

    await supabaseAdmin
      .from("clubs")
      .update({ stripe_customer_id: customerId })
      .eq("id", clubId);
  }

  const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData = {
  metadata: {
    club_id: String(clubId),
    package_key: String(packageKey),
    agreement_accepted: "true",
    agreement_version: AGREEMENT_VERSION,
  },
};

if (packageKey === "basic") {
  subscriptionData.trial_period_days = 60;
}
  /* ===============================
     4️⃣ Checkout session
  =============================== */

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,

    line_items: [{ price: priceId, quantity: 1 }],

    allow_promotion_codes: true,

    metadata: {
      club_id: String(clubId),
      package_key: String(packageKey),
      agreement_accepted: "true", // 👈 EXTRA
      agreement_version: AGREEMENT_VERSION,
    },
  
  subscription_data: subscriptionData,

    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/club/${clubSlug}/dashboard?upgrade=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
  });

  return Response.json({ url: session.url });
}