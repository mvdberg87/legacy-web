import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { clubId, clubSlug, packageKey, priceId, email } = await req.json();

  /* ===============================
     1️⃣ Haal bestaande customer op
  =============================== */

  const { data: club } = await supabaseAdmin
    .from("clubs")
    .select("stripe_customer_id")
    .eq("id", clubId)
    .maybeSingle(); // 👈 belangrijk!

  let customerId = club?.stripe_customer_id;

  /* ===============================
     2️⃣ Maak customer als niet bestaat
  =============================== */

  if (!customerId) {
    const customer = await stripe.customers.create({
      email,
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

  /* ===============================
     3️⃣ Checkout session
  =============================== */

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId, // 👈 dit is key

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