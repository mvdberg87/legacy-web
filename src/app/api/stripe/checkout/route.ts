import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { AGREEMENT_VERSION } from "@/lib/constants";

export async function POST(req: Request) {
  const {
    clubId,
    clubSlug,
    packageKey,
    priceId,
    email,
    agreementAccepted, // 👈 NIEUW
  } = await req.json();

  /* ===============================
     ❌ 0️⃣ Check agreement (CRUCIAAL)
  =============================== */

  if (!agreementAccepted) {
    return new Response("Agreement required", { status: 400 });
  }

  /* ===============================
     1️⃣ Haal club + customer op
  =============================== */

  const { data: club } = await supabaseAdmin
    .from("clubs")
    .select("stripe_customer_id, agreement_accepted")
    .eq("id", clubId)
    .maybeSingle();

  let customerId = club?.stripe_customer_id;

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
     4️⃣ Checkout session
  =============================== */

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,

    line_items: [{ price: priceId, quantity: 1 }],

    metadata: {
      club_id: String(clubId),
      package_key: String(packageKey),
      agreement_accepted: "true", // 👈 EXTRA
      agreement_version: AGREEMENT_VERSION,
    },

    subscription_data: {
      metadata: {
        club_id: String(clubId),
        package_key: String(packageKey),
        agreement_accepted: "true",
        agreement_version: AGREEMENT_VERSION,
      },
    },

    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/club/${clubSlug}/dashboard?upgrade=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
  });

  return Response.json({ url: session.url });
}