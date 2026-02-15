import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { clubId, packageKey } = await req.json();

  if (!clubId || !packageKey) {
    return NextResponse.json({ error: "Input ontbreekt" }, { status: 400 });
  }

  const start = new Date();
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);

  await supabaseAdmin
    .from("clubs")
    .update({
      active_package: packageKey,
      subscription_start: start.toISOString(),
      subscription_end: end.toISOString(),
      subscription_status: "active",
    })
    .eq("id", clubId);

  return NextResponse.json({ success: true });
}
