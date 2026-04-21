import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { userId, email } = await req.json();

  if (!userId || !email) {
    return NextResponse.json(
      { error: "Missing userId or email" },
      { status: 400 }
    );
  }

  const normalizedEmail = email.toLowerCase();

  /* ===============================
     0️⃣ Check of email al bestaat
  =============================== */

  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", normalizedEmail)
    .neq("user_id", userId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Email is al in gebruik" },
      { status: 400 }
    );
  }

  /* ===============================
     1️⃣ Auth email aanpassen
  =============================== */

  const { data: updatedUser, error } =
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      email: normalizedEmail,
    });

  if (error) {
    console.error("EMAIL UPDATE ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  /* ===============================
     2️⃣ Profile email aanpassen
  =============================== */

  await supabaseAdmin
    .from("profiles")
    .update({ email: normalizedEmail })
    .eq("user_id", userId);

  /* ===============================
     3️⃣ Response
  =============================== */

  return NextResponse.json({
    success: true,
    email: updatedUser.user?.email,
  });
}