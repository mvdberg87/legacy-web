// src/app/club/[slug]/layoutClient.tsx
"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "../../../lib/supabaseBrowser";

export default function ClubLayoutClient({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const [club, setClub] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const resolved = await Promise.resolve(params);
      const slug = resolved.slug;
      const supabase = getSupabaseBrowser();
      const { data } = await supabase
        .from("clubs")
        .select("name, logo_url, color_primary, color_secondary, bg_pattern_url")
        .eq("slug", slug)
        .maybeSingle();
      setClub(data);
    })();
  }, [params]);

  const primary = club?.color_primary ?? "#001F5B";
  const secondary = club?.color_secondary ?? "#FFFFFF";
  const logo = club?.logo_url ?? "https://placehold.co/100x100?text=Logo";
  const name = club?.name ?? "Club";
  const bgPattern = club?.bg_pattern_url ?? "";

  return (
    <div
      style={{
        "--club-primary": primary,
        "--club-secondary": secondary,
      } as React.CSSProperties}
      className="min-h-screen font-sans"
    >
      <div
        className="relative min-h-screen"
        style={{
          backgroundColor: secondary,
          backgroundImage: bgPattern ? `url(${bgPattern})` : "none",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          color: "#111",
        }}
      >
        <header
          style={{
            backgroundColor: primary,
            color: secondary,
            padding: "1rem 0",
            borderBottom: `4px solid ${primary}`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex items-center justify-center gap-4 max-w-3xl mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt={`${name} logo`}
              className="h-12 w-12 rounded-lg bg-white p-1 object-contain"
            />
            <h1 className="text-xl font-semibold tracking-wide">{name}</h1>
          </div>
        </header>

        <main className="max-w-3xl mx-auto my-8 px-4">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            {children}
          </div>
        </main>

        <footer className="text-center text-sm text-gray-500 py-4">
          Powered by <strong>Sponsorjobs</strong>
        </footer>
      </div>
    </div>
  );
}
