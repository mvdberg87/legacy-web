import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://www.sponsorjobs.nl";

export async function GET(req: Request) {

  const auth = req.headers.get("authorization");

  if (
    auth !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {

  const today = new Date();

  const { data: ads, error } =
  await supabaseAdmin
    .from(
      "admin_advertisements_overview"
    )
    .select("*")
    .eq("status", "active")
    .is("deleted_at", null);

if (error) {
  console.error(error);

  return NextResponse.json(
    {
      error: "Failed to load advertisements",
    },
    {
      status: 500,
    }
  );
}

  const result = {
    total: ads?.length ?? 0,

    expires90: [] as string[],
    expires60: [] as string[],
    expires30: [] as string[],
    expired: [] as string[],
  };

  for (const ad of ads ?? []) {

  const endDate =
    new Date(ad.end_date);

  const diff =
    Math.ceil(
      (endDate.getTime() -
        today.getTime()) /
        (1000 * 60 * 60 * 24)
    );

  /* =========================
     90 DAGEN
  ========================= */

  if (
    diff <= 90 &&
    diff > 60 &&
    !ad.reminder_90_sent
  ) {

    console.log(
      "90 dagen reminder:",
      ad.company_name
    );

    await fetch(
  `${siteUrl}/api/send-email`,
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({
      type:
        "advertisement_reminder_90",

      companyName:
        ad.company_name,

      companyEmail:
        ad.company_email,

      clubName:
        ad.club_name,

      endDate:
        ad.end_date,

      autoRenew:
        ad.auto_renew,
    }),
  }
);

    await supabaseAdmin
      .from(
        "company_advertisements"
      )
      .update({
        reminder_90_sent: true,
      })
      .eq("id", ad.id);

    result.expires90.push(
      ad.company_name
    );
  }

  /* =========================
     60 DAGEN
  ========================= */

  if (
    diff <= 60 &&
    diff > 30 &&
    !ad.reminder_60_sent
  ) {

    console.log(
      "60 dagen reminder:",
      ad.company_name
    );

    await fetch(
  `${siteUrl}/api/send-email`,
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({
      type:
        "advertisement_reminder_60",

      companyName:
        ad.company_name,

      companyEmail:
        ad.company_email,

      clubName:
        ad.club_name,

      endDate:
        ad.end_date,

      autoRenew:
        ad.auto_renew,
    }),
  }
);

    await supabaseAdmin
      .from(
        "company_advertisements"
      )
      .update({
        reminder_60_sent: true,
      })
      .eq("id", ad.id);

    result.expires60.push(
      ad.company_name
    );
  }

  /* =========================
     30 DAGEN
  ========================= */

  if (
    diff <= 30 &&
    diff >= 0 &&
    !ad.reminder_30_sent
  ) {

    console.log(
      "30 dagen reminder:",
      ad.company_name
    );

    await fetch(
  `${siteUrl}/api/send-email`,
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({
      type:
        "advertisement_reminder_30",

      companyName:
        ad.company_name,

      companyEmail:
        ad.company_email,

      clubName:
        ad.club_name,

      endDate:
        ad.end_date,

      autoRenew:
        ad.auto_renew,
    }),
  }
);

    await supabaseAdmin
      .from(
        "company_advertisements"
      )
      .update({
        reminder_30_sent: true,
      })
      .eq("id", ad.id);

    result.expires30.push(
      ad.company_name
    );
  }

  /* =========================
     VERLOPEN
  ========================= */

  if (diff < 0)

  /* =========================
     AUTO RENEW
  ========================= */

  if (ad.auto_renew) {

    const newEndDate =
      new Date(ad.end_date);

    newEndDate.setFullYear(
      newEndDate.getFullYear() + 1
    );

    await supabaseAdmin
      .from(
        "company_advertisements"
      )
      .update({
        end_date:
          newEndDate
            .toISOString(),

        reminder_90_sent:
          false,

        reminder_60_sent:
          false,

        reminder_30_sent:
          false,
      })
      .eq("id", ad.id);

      if (ad.club_id) {
  await supabaseAdmin
    .from("subscription_events")
    .insert({
      club_id: ad.club_id,
      event_type: "advertisement_renewed",
    });
}

    await fetch(
      `${siteUrl}/api/send-email`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          type:
            "advertisement_renewed",

          companyName:
            ad.company_name,

          companyEmail:
            ad.company_email,

          clubName:
            ad.club_name,

          endDate:
            newEndDate,
        }),
      }
    );

    result.expired.push(
      `${ad.company_name} renewed`
    );

  } else {

    /* =========================
       GEEN AUTO RENEW
    ========================= */

    await supabaseAdmin
      .from(
        "company_advertisements"
      )
      .update({
        status: "expired",
      })
      .eq("id", ad.id);

      if (ad.club_id) {
  await supabaseAdmin
    .from("subscription_events")
    .insert({
      club_id: ad.club_id,
      event_type: "advertisement_expired",
    });
}

    result.expired.push(
      `${ad.company_name} expired`
    );
  }
}

    return NextResponse.json(result);

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}