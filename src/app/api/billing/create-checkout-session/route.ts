// src/app/api/billing/create-checkout-session/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

/* ===============================
   Stripe client (SERVER ONLY)
   =============================== */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

/* ===============================
   Stripe price mapping
   =============================== */

const PRICE_IDS: Record<
  "basic" | "plus" | "pro" | "unlimited",
  string
> = {
  basic: process.env.STRIPE_PRICE_BASIC!,
  plus: process.env.STRIPE_PRICE_PLUS!,
  pro: process.env.STRIPE_PRICE_PRO!,
  unlimited: process.env.STRIPE_PRICE_UNLIMITED!,
};

/* ===============================
   POST
   =============================== */

export async function POST(req: NextRequest) {
  try {
    const { packageKey } = (await req.json()) as {
      packageKey?: "basic" | "plus" | "pro" | "unlimited";
    };

    if (!packageKey) {
      return NextResponse.json(
        { error: "packageKey ontbreekt" },
        { status: 400 }
      );
    }

    /* ===============================
       1. Supabase server client (AUTH)
       =============================== */
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Niet ingelogd" },
        { status: 401 }
      );
    }

    /* ===============================
       2. Profiel → club_id
       =============================== */
    const { data: profile } = await supabase
      .from("profiles")
      .select("club_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile?.club_id) {
      return NextResponse.json(
        { error: "Geen club gekoppeld aan gebruiker" },
        { status: 404 }
      );
    }

    /* ===============================
       3. Club ophalen
       =============================== */
    const { data: club } = await supabase
      .from("clubs")
      .select(
        `
        id,
        name,
        email,
        stripe_customer_id
      `
      )
      .eq("id", profile.club_id)
      .maybeSingle();

    if (!club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    /* ===============================
       4. Stripe price
       =============================== */
    const priceId = PRICE_IDS[packageKey];

    if (!priceId) {
      return NextResponse.json(
        { error: "Onbekend abonnement" },
        { status: 400 }
      );
    }

    /* ===============================
       5. Checkout session
       =============================== */
    console.log("🧪 packageKey:", packageKey);
console.log("🧪 priceId:", priceId);
console.log("🧪 club:", club);
    
       const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: club.stripe_customer_id ?? undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/club/billing/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/club/billing/cancel`,
      metadata: {
        club_id: club.id,
        package_key: packageKey,
      },
    });

    return NextResponse.json({
      checkoutUrl: session.url,
    });
  } catch (err) {
    console.error("❌ create-checkout-session error:", err);
    return NextResponse.json(
      { error: "Interne serverfout" },
      { status: 500 }
    );
  }
}
