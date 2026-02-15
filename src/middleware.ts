// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname, origin } = req.nextUrl;

  /* ======================================================
     0️⃣ Publieke routes (nooit blokkeren)
  ====================================================== */
  if (
    pathname === "/login" ||
    pathname === "/admin/login" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/onboarding") ||
    pathname === "/pending" ||
    pathname === "/unauthorized"
  ) {
    return res;
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isClubRoute = pathname.startsWith("/club");

  // Alles buiten admin/club laten we door
  if (!isAdminRoute && !isClubRoute) {
    return res;
  }

  /* ======================================================
     1️⃣ Supabase server client
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
     2️⃣ Auth check (verplicht)
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
     3️⃣ Profiel ophalen (role + club_id)
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
     - Alleen role === admin mag /admin/*
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
     - /club = altijd toegestaan (onboarding / router)
     - /club/* vereist role === club + club_id
  ====================================================== */
  if (isClubRoute) {
    const isClubRoot = pathname === "/club";

    if (!isClubRoot) {
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
    }
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/club/:path*"],
};
