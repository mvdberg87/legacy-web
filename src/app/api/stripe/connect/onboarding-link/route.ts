import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!,
  {
    apiVersion: "2025-12-15.clover",
  }
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

    const { data: club } = await supabaseAdmin
      .from("clubs")
      .select("stripe_connect_account_id, slug")
      .eq("id", clubId)
      .single();

    if (!club?.stripe_connect_account_id) {
      return NextResponse.json(
        { error: "No Connect account found" },
        { status: 400 }
      );
    }

    const accountLink =
      await stripe.accountLinks.create({
        account: club.stripe_connect_account_id,

        refresh_url:
          `${process.env.NEXT_PUBLIC_SITE_URL}/club/${club.slug}/dashboard?stripe=refresh`,

        return_url:
          `${process.env.NEXT_PUBLIC_SITE_URL}/club/${club.slug}/dashboard?stripe=success`,

        type: "account_onboarding",
      });

    return NextResponse.json({
      url: accountLink.url,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to create onboarding link" },
      { status: 500 }
    );
  }
}