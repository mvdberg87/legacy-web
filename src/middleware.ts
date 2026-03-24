// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { AGREEMENT_VERSION } from "@/lib/constants";

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
    pathname.includes("/jobs/public") ||
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
  get(name: string) {
    return req.cookies.get(name)?.value;
  },
  set(name: string, value: string, options: any) {
    res.cookies.set(name, value, options);
  },
  remove(name: string, options: any) {
    res.cookies.set(name, "", { ...options, maxAge: 0 });
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
    .select("role, club_id, active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.redirect(new URL("/unauthorized", origin));
  }

  if (profile.active === false) {
  return NextResponse.redirect(
    new URL(isAdminRoute ? "/admin/login" : "/login", origin)
  );
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

  const { data: club } = await supabase
    .from("clubs")
    .select(`
  active_package,
  basic_end,
  billing_status,
  billing_override,
  payment_failed_at,
  agreement_accepted,
  agreement_version
`)
    .eq("id", profile.club_id)
    .maybeSingle();

  if (!club) {
    return NextResponse.redirect(
      new URL("/unauthorized", origin)
    );
  }

  /* ===============================
     MANUAL OVERRIDE
  =============================== */
  if (club.billing_override) {
    return res;
  }

  /* ===============================
   Agreement check + versioning
=============================== */
const isPaid = club.active_package !== "basic";
const isAgreementPage = pathname.startsWith("/club/agreement-required");

const needsAgreement =
  isPaid &&
  (
    !club.agreement_accepted ||
    club.agreement_version !== AGREEMENT_VERSION
  );

if (needsAgreement && !isAgreementPage) {
  return NextResponse.redirect(
    new URL("/club/agreement-required", origin)
  );
}

  /* ===============================
   BASIC VERLOPEN CHECK
=============================== */
if (
  club.active_package === "basic" &&
  club.basic_end
) {
  const now = new Date();
  const end = new Date(club.basic_end);

  if (now > end) {
    return NextResponse.redirect(
      new URL("/billing-blocked", origin)
    );
  }
}

  /* ===============================
     Cancelled
  =============================== */
  if (club.billing_status === "canceled") {
    return NextResponse.redirect(
      new URL("/billing-blocked", origin)
    );
  }

  /* ===============================
     Blocked
  =============================== */
  if (club.billing_status === "blocked") {
    return NextResponse.redirect(
      new URL("/billing-blocked", origin)
    );
  }

  /* ===============================
     Past due grace
  =============================== */
  if (
    club.billing_status === "past_due" &&
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