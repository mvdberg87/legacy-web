import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: NextRequest
) {

  try {

    const {
      advertisementId,
    } = await req.json();

    if (!advertisementId) {
      return NextResponse.json(
        { error: "Missing advertisementId" },
        { status: 400 }
      );
    }

    const { data: advertisement } =
      await supabaseAdmin
        .from(
          "company_advertisements"
        )
        .select("*")
        .eq("id", advertisementId)
        .single();

    if (!advertisement) {
      return NextResponse.json(
        { error: "Advertisement not found" },
        { status: 404 }
      );
    }

    await supabaseAdmin
      .from(
        "company_advertisements"
      )
      .update({
        status: "active",
        activated_at:
          new Date().toISOString(),
      })
      .eq("id", advertisementId);

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { error: "Activation failed" },
      { status: 500 }
    );
  }
}