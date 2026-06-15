import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
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
  subscription_status: null,
})
    .eq("id", clubId);

  return NextResponse.json({ success: true });
}
