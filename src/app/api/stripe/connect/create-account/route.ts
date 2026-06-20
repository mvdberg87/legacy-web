import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

    const { data: club } = await supabaseAdmin
      .from("clubs")
      .select("id,name,stripe_connect_account_id")
      .eq("id", clubId)
      .single();

    if (!club) {
      return NextResponse.json(
        { error: "Club not found" },
        { status: 404 }
      );
    }

    // Bestaat al?
    if (club.stripe_connect_account_id) {
      return NextResponse.json({
        success: true,
        accountId: club.stripe_connect_account_id,
      });
    }

    const account = await stripe.accounts.create({
      type: "express",
      country: "NL",

      business_type: "company",

      capabilities: {
        transfers: {
          requested: true,
        },
      },

      metadata: {
        club_id: club.id,
        club_name: club.name,
      },
    });

    await supabaseAdmin
      .from("clubs")
      .update({
        stripe_connect_account_id: account.id,
      })
      .eq("id", clubId);

    await supabaseAdmin
      .from("club_stripe_accounts")
      .insert({
        club_id: club.id,
        stripe_connect_account_id: account.id,
      });

    return NextResponse.json({
      success: true,
      accountId: account.id,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}