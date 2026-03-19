import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { clubId, clubSlug, packageKey, priceId, email } = await req.json();

  /* ===============================
     1️⃣ Maak customer aan
  =============================== */

  const customer = await stripe.customers.create({
    email,
    metadata: {
      club_id: String(clubId),
    },
  });

  /* ===============================
     2️⃣ Checkout session
  =============================== */

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",

    customer: customer.id, // 👈 VERPLICHT

    line_items: [{ price: priceId, quantity: 1 }],

    metadata: {
      club_id: String(clubId),
      package_key: String(packageKey),
    },

    subscription_data: {
      metadata: {
        club_id: String(clubId),
        package_key: String(packageKey),
      },
    },

    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/club/${clubSlug}/dashboard?upgrade=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
  });

  return Response.json({ url: session.url });
}