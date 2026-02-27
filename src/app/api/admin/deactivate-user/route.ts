// src/app/api/admin/deactivate-user/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // 1️⃣ profiel op inactive zetten
  await supabaseAdmin
    .from("profiles")
    .update({ active: false })
    .eq("id", userId);

  // 2️⃣ optioneel: user blokkeren in auth
  await supabaseAdmin.auth.admin.updateUserById(userId, {
    ban_duration: "876000h" // 100 jaar 😉
  });

  return NextResponse.json({ success: true });
}