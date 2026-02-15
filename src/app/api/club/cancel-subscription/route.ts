import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { clubId } = await req.json();

    if (!clubId) {
      return NextResponse.json(
        { error: "clubId ontbreekt" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("clubs")
      .update({
        subscription_cancelled_at: new Date().toISOString(),
      })
      .eq("id", clubId)
      .is("subscription_cancelled_at", null);

    if (error) {
      console.error("❌ cancel-subscription error:", error);
      return NextResponse.json(
        { error: "Opzeggen mislukt" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ cancel-subscription fatal:", err);
    return NextResponse.json(
      { error: "Interne serverfout" },
      { status: 500 }
    );
  }
}
