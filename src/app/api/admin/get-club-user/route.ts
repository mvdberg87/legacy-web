import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { clubId } = await req.json();

    if (!clubId) {
  return NextResponse.json(
    { error: "Missing clubId" },
    { status: 400 }
  );
}

    /* ===============================
   ADMIN AUTH CHECK
=============================== */

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name) {
        return req.cookies.get(name)?.value;
      },
    },
  }
);

const {
  data: { user: adminUser },
} = await supabase.auth.getUser();

if (!adminUser) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

const {
  data: adminProfile,
  error: adminProfileError,
} = await supabaseAdmin
  .from("profiles")
  .select("role")
  .eq("user_id", adminUser.id)
  .single();

if (
  adminProfileError ||
  !adminProfile ||
  adminProfile.role !== "admin"
) {
  return NextResponse.json(
    { error: "Admin only" },
    { status: 403 }
  );
}

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id, user_id, active")
      .eq("club_id", clubId)
      .eq("active", true)
      .maybeSingle();

    // ✅ eerst checken
    if (!profile || error) {
      return NextResponse.json({ user: null });
    }

    // ✅ daarna pas gebruiken
    const userId = profile.user_id;

    const { data: user, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: userId,
        email: user.user?.email ?? null,
        active: profile.active,
      },
    });

  } catch (err) {
    console.error("GET CLUB USER ERROR:", err);

    return NextResponse.json(
  {
    user: null,
    error: "Failed to fetch user",
  },
  { status: 500 }
);
  }
}