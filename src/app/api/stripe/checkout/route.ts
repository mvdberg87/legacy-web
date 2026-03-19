import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { clubId, clubSlug, packageKey, priceId, email } = await req.json();

  // 🔥 HIER TOEVOEGEN
  console.log("CHECKOUT BODY:", {
    clubId,
    clubSlug,
    packageKey,
    priceId,
    email,
  });

  // 🔥 EXTRA VEILIG (voorkomt 500)
  if (!priceId) {
    return Response.json(
      { error: "Missing priceId" },
      { status: 400 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email,
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