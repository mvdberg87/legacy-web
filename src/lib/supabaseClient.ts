// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

let didLog = false; // log slechts 1x

function visibleCharCodes(s: string) {
  return Array.from(s).map((ch) => ch.charCodeAt(0));
}

export function getSupabase() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (!didLog && process.env.NODE_ENV !== "production") {
    didLog = true;
    console.log("🔍 SUPABASE DEBUG — RAW URL:", JSON.stringify(rawUrl));
    console.log("🔍 SUPABASE DEBUG — CHAR CODES:", visibleCharCodes(rawUrl));
    console.log("🔍 SUPABASE DEBUG — KEY present:", !!rawKey);
  }

  const url = rawUrl.trim().replace(/^['"]|['"]$/g, "").replace(/\/+$/, "");
  if (!url.startsWith("https://") || !url.endsWith(".supabase.co")) {
    throw new Error(
      `Invalid supabaseUrl: Provided URL is malformed (${url || "(leeg)"}).`
    );
  }
  if (!rawKey) {
    throw new Error("Missing Supabase anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY).");
  }

  return createClient(url, rawKey);
}

