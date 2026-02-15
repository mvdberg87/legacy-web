// src/app/api/auth/set/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  // ⏳ 1. JSON body ophalen
  const { session } = await req.json();

  // ⏳ 2. Cookies asynchroon ophalen (Next.js 15 vereist await)
  const cookieStore = await cookies();

  // ⏳ 3. Supabase server client aanmaken
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: async (name: string, value: string, options) => {
          try {
            await cookieStore.set({ name, value, ...options });
          } catch {
            // Middleware heeft geen schrijfrechten, dus negeren
          }
        },
        remove: async (name: string, options) => {
          try {
            await cookieStore.set({ name, value: "", ...options });
          } catch {
            // ook negeren
          }
        },
      },
    }
  );

  // ⏳ 4. Sessie veilig opslaan in cookies
  await supabase.auth.setSession(session);

  // ✅ 5. Bevestiging teruggeven
  return NextResponse.json({ ok: true });
}
