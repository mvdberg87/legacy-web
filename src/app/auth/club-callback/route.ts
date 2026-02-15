// src/app/auth/club-callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    console.warn("❌ Geen code in callback URL");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("🔐 CLUB CALLBACK HIT");

  // 👉 Na login altijd door naar /club
  const response = NextResponse.redirect(new URL("/club", req.url));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  /* -------------------------------------------------
     1️⃣ PKCE code → sessie
     ------------------------------------------------- */
  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("❌ PKCE exchange mislukt:", exchangeError);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  /* -------------------------------------------------
     2️⃣ User ophalen (optioneel, puur sanity check)
     ------------------------------------------------- */
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

   console.log("👤 CALLBACK USER:", user?.id, user?.email);

  if (userError || !user) {
    console.error("❌ Geen user na PKCE exchange");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("⛔ Geen user → redirect /login");
  console.log("✅ Callback OK → redirect /club");

  /* -------------------------------------------------
     3️⃣ GEEN club-logica hier ❌
     ------------------------------------------------- */

  return response;
}
