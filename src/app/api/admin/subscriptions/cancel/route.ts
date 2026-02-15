import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { clubId } = await req.json();

    if (!clubId) {
      return NextResponse.json(
        { error: "clubId ontbreekt" },
        { status: 400 }
      );
    }

    await supabaseAdmin
      .from("clubs")
      .update({
        subscription_status: "cancelled",
        subscription_cancelled_at: new Date().toISOString(),
      })
      .eq("id", clubId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("cancel subscription error", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
