// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const GRACE_DAYS = 7;

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname, origin } = req.nextUrl;

  /* ======================================================
     0️⃣ Publieke routes
  ====================================================== */
  if (
    pathname === "/login" ||
    pathname === "/admin/login" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/onboarding") ||
    pathname === "/pending" ||
    pathname === "/unauthorized" ||
    pathname === "/billing-blocked" ||
    pathname.startsWith("/club/billing")
  ) {
    return res;
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isClubRoute = pathname.startsWith("/club");

  if (!isAdminRoute && !isClubRoute) {
    return res;
  }

  /* ======================================================
     1️⃣ Supabase client
  ====================================================== */
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

  /* ======================================================
     2️⃣ Auth check
  ====================================================== */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL(isAdminRoute ? "/admin/login" : "/login", origin)
    );
  }

  /* ======================================================
     3️⃣ Profile ophalen
  ====================================================== */
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, club_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.redirect(new URL("/unauthorized", origin));
  }

  /* ======================================================
     4️⃣ Admin rules
  ====================================================== */
  if (isAdminRoute) {
    if (profile.role !== "admin") {
      return NextResponse.redirect(
        new URL("/unauthorized", origin)
      );
    }

    return res;
  }

  /* ======================================================
     5️⃣ Club rules
  ====================================================== */
  if (isClubRoute) {
  if (profile.role !== "club") {
    return NextResponse.redirect(
      new URL("/unauthorized", origin)
    );
  }

  if (!profile.club_id) {
    return NextResponse.redirect(
      new URL("/onboarding/claim", origin)
    );
  }

  /* ===============================
     Club ophalen
  =============================== */
  const { data: club } = await supabase
    .from("clubs")
    .select("subscription_status, payment_failed_at, subscription_end")
    .eq("id", profile.club_id)
    .maybeSingle();

  if (!club) {
    return NextResponse.redirect(
      new URL("/unauthorized", origin)
    );
  }

  /* ===============================
     Realtime trial check
  =============================== */
  if (
    club.subscription_status === "trial" &&
    club.subscription_end
  ) {
    const now = new Date();
    const end = new Date(club.subscription_end);

    if (now > end) {
      await supabase
        .from("clubs")
        .update({ subscription_status: "blocked" })
        .eq("id", profile.club_id);

      return NextResponse.redirect(
        new URL("/billing-blocked", origin)
      );
    }
  }

  /* ===============================
     Cancelled
  =============================== */
  if (club.subscription_status === "cancelled") {
    return NextResponse.redirect(
      new URL("/billing-blocked", origin)
    );
  }

  /* ===============================
     Blocked / expired
  =============================== */
  if (
    club.subscription_status === "blocked" ||
    club.subscription_status === "expired"
  ) {
    return NextResponse.redirect(
      new URL("/billing-blocked", origin)
    );
  }

  /* ===============================
     Past due grace
  =============================== */
  if (
    club.subscription_status === "past_due" &&
    club.payment_failed_at
  ) {
    const diff =
      Date.now() -
      new Date(club.payment_failed_at).getTime();

    const days = diff / (1000 * 60 * 60 * 24);

    if (days > GRACE_DAYS) {
      return NextResponse.redirect(
        new URL("/billing-blocked", origin)
      );
    }
  }
}
  
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/club/:path*"],
};