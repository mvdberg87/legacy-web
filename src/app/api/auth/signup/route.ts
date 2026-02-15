// src/app/api/auth/signup/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

/* ===============================
   POST /api/auth/signup
   =============================== */
export async function POST(req: NextRequest) {
  try {
    const { clubName, contactName, email } = await req.json();

    if (!clubName || !contactName || !email) {
      return NextResponse.json(
        { error: "Alle velden zijn verplicht" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();
    const adminEmail = process.env.SPONSORJOBS_ADMIN_EMAILS?.toLowerCase();

    /* ======================================================
       1. 🔒 DEDUPLICATIE: bestaat er al een pending aanvraag?
       ====================================================== */

    const { data: existingRequest, error: checkError } =
      await supabaseAdmin
        .from("club_signup_requests")
        .select("id")
        .eq("email", normalizedEmail)
        .eq("status", "pending")
        .maybeSingle();

    if (checkError) {
      console.error("❌ Signup dedupe check error:", checkError);
      return NextResponse.json(
        { error: "Aanmelding controleren mislukt" },
        { status: 500 }
      );
    }

    // 👉 Als er al een pending aanvraag is: idempotent succes
    if (existingRequest) {
      return NextResponse.json({
        success: true,
        message: "Aanvraag is al ontvangen",
      });
    }

    /* ======================================================
       2. Signup request opslaan (ENIGE DB-ACTIE)
       ====================================================== */

    const { error: signupError } = await supabaseAdmin
      .from("club_signup_requests")
      .insert({
        club_name: clubName,
        email: normalizedEmail,
        message: contactName,
        status: "pending",
      });

    if (signupError) {
      console.error("❌ club signup insert error:", signupError);
      return NextResponse.json(
        { error: "Aanmelding opslaan mislukt" },
        { status: 500 }
      );
    }

    /* ======================================================
       3. Admin notificatie (MAIL)
       ====================================================== */

    if (adminEmail) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        replyTo: process.env.EMAIL_REPLY_TO,
        to: [adminEmail],
        subject: "🆕 Nieuwe club aangemeld",
        html: `
          <h2>Nieuwe club aangemeld</h2>
          <p><strong>Club:</strong> ${clubName}</p>
          <p><strong>Contactpersoon:</strong> ${contactName}</p>
          <p><strong>E-mail:</strong> ${normalizedEmail}</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">
              👉 Ga naar admin dashboard
            </a>
          </p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Signup route error:", err);
    return NextResponse.json(
      { error: "Interne serverfout" },
      { status: 500 }
    );
  }
}
