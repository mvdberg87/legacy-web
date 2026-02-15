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

    const { data: club, error } = await supabaseAdmin
      .from("clubs")
      .select("subscription_end")
      .eq("id", clubId)
      .maybeSingle();

    if (error || !club) {
      return NextResponse.json(
        { error: "Club niet gevonden" },
        { status: 404 }
      );
    }

    const baseDate = club.subscription_end
      ? new Date(club.subscription_end)
      : new Date();

    const newEnd = new Date(baseDate);
    newEnd.setFullYear(newEnd.getFullYear() + 1);

    await supabaseAdmin
      .from("clubs")
      .update({
        subscription_end: newEnd.toISOString(),
        subscription_status: "active",
        subscription_cancelled_at: null,
      })
      .eq("id", clubId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("extend subscription error", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
