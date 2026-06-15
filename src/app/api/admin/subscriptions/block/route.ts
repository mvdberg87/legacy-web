import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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
        subscription_status: "blocked",
      })
      .eq("id", clubId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Blokkeren mislukt" },
      { status: 500 }
    );
  }
}