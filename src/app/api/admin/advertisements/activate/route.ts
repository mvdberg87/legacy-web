import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: NextRequest
) {

  try {

    console.log("🔥 ACTIVATE ROUTE HIT");

    const {
      advertisementId,
    } = await req.json();

    console.log("🔥 ADVERTISEMENT ID:", advertisementId);

    if (!advertisementId) {
      return NextResponse.json(
        { error: "Missing advertisementId" },
        { status: 400 }
      );
    }

    const { data: advertisement } =
      await supabaseAdmin
        .from(
          "company_advertisements"
        )
        .select("*")
        .eq("id", advertisementId)
        .single();

        console.log(
  "🔥 ADVERTISEMENT:",
  advertisement
);

    if (!advertisement) {
      return NextResponse.json(
        { error: "Advertisement not found" },
        { status: 404 }
      );
    }

    const { error } =
  await supabaseAdmin
    .from(
      "company_advertisements"
    )
    .update({
      status: "active",
      activated_at:
        new Date().toISOString(),
    })
    .eq("id", advertisementId);

    await fetch(
  `${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`,
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({
      type:
        "advertisement_activated",

      companyEmail:
        advertisement.company_email,

      companyName:
        advertisement.company_name,
    }),
  }
);

await fetch(
  `${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`,
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({
      type:
        "advertisement_activated",

      companyEmail:
        advertisement.company_email,

      companyName:
        advertisement.company_name,
    }),
  }
);

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { error: "Activation failed" },
      { status: 500 }
    );
  }
}