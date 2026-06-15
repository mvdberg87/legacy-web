import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("clubs")
    .select(`
  id,
  name,
  email,
  active_package,
  subscription_status,
  subscription_start,
  subscription_end,
  has_paid_subscription,
  billing_override
`)
    .order("subscription_end", { ascending: true });

  if (error) {
  console.error(error);

  return NextResponse.json(
    {
      error: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    },
    { status: 500 }
  );
}

  return NextResponse.json({ clubs: data });
}
