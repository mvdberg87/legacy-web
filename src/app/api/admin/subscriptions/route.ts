import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("clubs")
    .select(
      `
      id,
      name,
      email,
      active_package,
      subscription_status,
      subscription_start,
      subscription_end
    `
    )
    .in("subscription_status", [
      "trial",
      "blocked",
      "expired",
      "cancelled",
    ])
    .order("subscription_end", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ clubs: data });
}
