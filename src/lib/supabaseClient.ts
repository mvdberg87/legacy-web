import { createClient } from "@supabase/supabase-js";

export function getSupabase() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  // Debug naar serverconsole:
  console.log("RAW URL =", JSON.stringify(rawUrl));
  console.log("RAW KEY present =", !!rawKey);
  // Toon de charcodes (ontmaskert zero-width/BOM/spaties):
  console.log("URL char codes =", Array.from(rawUrl).map(c => c.charCodeAt(0)));

  // Schoonmaken:
  const url = rawUrl.replace(/["'\u200B\u200C\u200D\uFEFF]/g, "").trim().replace(/\/+$/,"");
  const key = rawKey.replace(/["'\u200B\u200C\u200D\uFEFF]/g, "").trim();

  console.log("CLEAN URL =", JSON.stringify(url));

  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}
