import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();

  const { club_id, current_package, requested_package } = body;

  if (!club_id || !requested_package) {
    return NextResponse.json(
      { error: "Ongeldige aanvraag" },
      { status: 400 }
    );
  }

  await supabase.from("club_upgrade_requests").insert({
    club_id,
    current_package,
    requested_package,
  });

  return NextResponse.json({ success: true });
}
