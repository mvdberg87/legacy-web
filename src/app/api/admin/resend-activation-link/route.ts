import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { requestId } = await req.json();

  if (!requestId) {
    return NextResponse.json({ error: "requestId ontbreekt" }, { status: 400 });
  }

  // 1. haal signup request op
  const { data: signup } = await supabaseAdmin
    .from("club_signup_requests")
    .select("id, email, club_name, status")
    .eq("id", requestId)
    .maybeSingle();

  if (!signup || signup.status !== "approved") {
    return NextResponse.json(
      { error: "Aanvraag niet gevonden of niet goedgekeurd" },
      { status: 400 }
    );
  }

  // 2. nieuwe token
  const token = crypto.randomUUID();

  await supabaseAdmin
    .from("club_signup_requests")
    .update({ token })
    .eq("id", signup.id);

  // 3. mail opnieuw
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const claimUrl = `${baseUrl}/onboarding/claim?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: [signup.email],
    subject: `Nieuwe activatielink voor ${signup.club_name}`,
    html: `
      <p>Hier is je nieuwe activatielink:</p>
      <p><a href="${claimUrl}">Activeer je club</a></p>
      <p>Deze link is éénmalig geldig.</p>
    `,
  });

  return NextResponse.json({ success: true });
}
