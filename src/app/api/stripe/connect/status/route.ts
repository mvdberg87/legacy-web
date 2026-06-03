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
      .select("stripe_connect_account_id")
      .eq("id", clubId)
      .single();

    if (!club?.stripe_connect_account_id) {
      return NextResponse.json(
        { error: "No Connect account found" },
        { status: 400 }
      );
    }

    const account = await stripe.accounts.retrieve(
      club.stripe_connect_account_id
    );

    const onboardingCompleted =
      account.details_submitted === true;

    const payoutsEnabled =
      account.payouts_enabled === true;

    const chargesEnabled =
      account.charges_enabled === true;

    await supabaseAdmin
      .from("clubs")
      .update({
        stripe_connect_enabled:
          onboardingCompleted &&
          payoutsEnabled &&
          chargesEnabled,

        stripe_payouts_enabled:
          payoutsEnabled,
      })
      .eq("id", clubId);

    await supabaseAdmin
      .from("club_stripe_accounts")
      .update({
        onboarding_completed:
          onboardingCompleted,

        payouts_enabled:
          payoutsEnabled,
      })
      .eq(
        "stripe_connect_account_id",
        club.stripe_connect_account_id
      );

    return NextResponse.json({
      success: true,

      onboardingCompleted,
      payoutsEnabled,
      chargesEnabled,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to retrieve status" },
      { status: 500 }
    );
  }
}