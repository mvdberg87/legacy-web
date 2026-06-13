import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

type SignupRequest = {
  id: string;
  club_name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
};

export async function POST(req: NextRequest) {
  try {
    const {
      requestId,
      reason,
    }: {
      requestId?: string;
      reason?: string;
    } = await req.json();

    if (!requestId) {
      return NextResponse.json(
        { error: "requestId ontbreekt" },
        { status: 400 }
      );
    }

    const { data: signupData, error: signupError } =
      await supabaseAdmin
        .from("club_signup_requests")
        .select("id, club_name, email, status")
        .eq("id", requestId)
        .single();

    if (signupError || !signupData) {
      return NextResponse.json(
        { error: "Aanvraag niet gevonden" },
        { status: 404 }
      );
    }

    const signup = signupData as SignupRequest;

    if (signup.status !== "pending") {
      return NextResponse.json(
        { error: "Aanvraag is al verwerkt" },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("club_signup_requests")
      .update({
        status: "rejected",
        rejection_reason: reason ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", signup.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Afkeuren mislukt" },
        { status: 500 }
      );
    }

    const reasonBlock = reason
      ? `
        <p>
          <strong>Reden:</strong><br/>
          ${reason}
        </p>
      `
      : "";

      console.log("📧 sending rejection mail to", signup.email);

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: [signup.email],
      subject: "Je aanvraag voor Sponsorjobs is beoordeeld",
      html: `
        <p>Beste vereniging,</p>

        <p>
          Bedankt voor jullie interesse in Sponsorjobs.
        </p>

        <p>
          Na beoordeling hebben we besloten de aanvraag
          op dit moment niet goed te keuren.
        </p>

        ${reasonBlock}

        <p>
          Hebben jullie vragen of denken jullie dat dit
          op een misverstand berust?
          Neem dan gerust contact met ons op.
        </p>

        <p>
          Sportieve groet,<br/>
          Sponsorjobs
        </p>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Afkeuren mislukt",
        message: err?.message,
      },
      { status: 500 }
    );
  }
}