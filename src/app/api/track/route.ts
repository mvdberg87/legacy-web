// src/app/api/track/route.ts
import { NextResponse } from "next/server";
import { saveTrackEvent, type TrackEvent } from "@/lib/track";

export const runtime = "edge"; // maakt file expliciet een module (optioneel)

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Partial<TrackEvent>;
  await saveTrackEvent({
    type: body.type ?? "unknown",
    payload: body.payload,
    ts: Date.now(),
  });
  return NextResponse.json({ ok: true });
}
 