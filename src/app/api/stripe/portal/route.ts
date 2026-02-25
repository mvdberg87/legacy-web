import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: NextRequest) {

  /* ===============================
     1️⃣ Auth check
  =============================== */

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* ===============================
     2️⃣ Haal club_id uit profile
  =============================== */

  const { data: profile } = await supabase
    .from("profiles")
    .select("club_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.club_id) {
    return NextResponse.json(
      { error: "No club linked to user" },
      { status: 400 }
    );
  }

  /* ===============================
     3️⃣ Haal subscription uit DB
  =============================== */

  const { data: club } = await supabaseAdmin
    .from("clubs")
    .select("stripe_subscription_id")
    .eq("id", profile.club_id)
    .maybeSingle();

  if (!club?.stripe_subscription_id) {
    return NextResponse.json(
      { error: "No Stripe subscription found" },
      { status: 400 }
    );
  }

  /* ===============================
     4️⃣ Stripe subscription ophalen
  =============================== */

  const subscription = await stripe.subscriptions.retrieve(
    club.stripe_subscription_id
  );

  if (!subscription.customer) {
    return NextResponse.json(
      { error: "No Stripe customer found" },
      { status: 400 }
    );
  }

  /* ===============================
     5️⃣ Portal session aanmaken
  =============================== */

  const portalSession =
    await stripe.billingPortal.sessions.create({
      customer: subscription.customer as string,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/club`,
    });

  return NextResponse.json({ url: portalSession.url });
}