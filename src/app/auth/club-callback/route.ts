import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/club", req.url)
  );

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

  // 🔥 BELANGRIJK: volledige URL meegeven
  const { error } = await supabase.auth.exchangeCodeForSession(req.url);

  if (error) {
    console.error("Exchange error:", error.message);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return response;
}
