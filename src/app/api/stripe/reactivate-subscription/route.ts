import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createServerClient } from "@supabase/ssr";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { clubId } = await req.json();

if (!clubId) {
  return NextResponse.json(
    { error: "Missing clubId" },
    { status: 400 }
  );
}

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

/* ===============================
   AUTH CHECK
=============================== */

if (!user) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

const { data: profile } = await supabaseAdmin
  .from("profiles")
  .select("club_id, role")
  .eq("user_id", user.id)
  .single();

if (!profile) {
  return NextResponse.json(
    { error: "No profile" },
    { status: 403 }
  );
}

const isAdmin = profile.role === "admin";

if (!isAdmin && profile.club_id !== clubId) {
  return NextResponse.json(
    { error: "Forbidden" },
    { status: 403 }
  );
}

/* ===============================
   PAS NU CLUB OPHALEN
=============================== */

const { data: club } = await supabaseAdmin
  .from("clubs")
  .select("stripe_subscription_id, subscription_cancelled_at")
  .eq("id", clubId)
  .single();

if (!club) {
  return NextResponse.json(
    { error: "Club not found" },
    { status: 404 }
  );
}

if (!club.subscription_cancelled_at) {
  return NextResponse.json(
    { error: "Abonnement is niet opgezegd" },
    { status: 400 }
  );
}

if (!club.stripe_subscription_id) {
  return NextResponse.json(
    { error: "Geen subscription gevonden" },
    { status: 400 }
  );
}

    // 🔥 Reactiveren in Stripe
    await stripe.subscriptions.update(
      club.stripe_subscription_id,
      {
        cancel_at_period_end: false,
      }
    );

    await supabaseAdmin
  .from("clubs")
  .update({
    subscription_cancelled_at: null,
    deleted_at: null, // 🔥 HEEL BELANGRIJK
    subscription_status: "active", // 👈 extra zekerheid
  })
  .eq("id", clubId);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Reactivate failed" },
      { status: 500 }
    );
  }
}