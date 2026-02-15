import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const payload = await req.json();

  const event = payload.type;
  const entityId = payload.data?.headers?.["x-entity-ref-id"];

  if (!entityId) {
    return NextResponse.json({ ok: true });
  }

  if (event === "email.opened") {
    await supabaseAdmin.rpc("increment_open_count", {
      report_id: entityId,
    });
  }

  return NextResponse.json({ received: true });
}
