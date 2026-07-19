import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const res = NextResponse.next();

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
          res.cookies.set(name, "", {
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Niet ingelogd.", {
      status: 401,
    });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    return new NextResponse("Geen toegang.", {
      status: 403,
    });
  }

  const { data: report, error } = await supabase
    .from("monthly_reports")
    .select("html")
    .eq("id", id)
    .maybeSingle();

  if (error || !report) {
  return new NextResponse("Rapport niet gevonden.", {
    status: 404,
  });
}

if (!report.html) {
  return new NextResponse(
    "Dit rapport is aangemaakt voordat HTML-opslag beschikbaar was. Vanaf de eerstvolgende maandrapportage kun je dit rapport hier bekijken.",
    {
      status: 404,
    }
  );
}

  return new NextResponse(report.html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}