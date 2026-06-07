import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const today = new Date();

  const in90 = new Date();
  in90.setDate(today.getDate() + 90);

  const in60 = new Date();
  in60.setDate(today.getDate() + 60);

  const in30 = new Date();
  in30.setDate(today.getDate() + 30);

  const { data } = await supabaseAdmin
    .from("company_advertisements")
    .select("*")
    .eq("status", "active")
    .is("deleted_at", null);

  return NextResponse.json({
    count: data?.length ?? 0,
  });
}