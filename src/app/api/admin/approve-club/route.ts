// src/app/api/admin/approve-club/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";
import type { User } from "@supabase/supabase-js";
import crypto from "crypto";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

/* ===============================
   Types
   =============================== */
type SignupRequest = {
  id: string;
  club_name: string;
  contact_name: string | null;
  email: string;
  phone: string | null;
  status: "pending" | "approved" | "rejected";
  selected_package: string;
};

/* ===============================
   Helpers
   =============================== */
function generateSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ===============================
   POST /api/admin/approve-club
   =============================== */
export async function POST(req: NextRequest) {
  try {
    console.log("🚀 approve-club START");

    const { requestId } = (await req.json()) as {
  requestId?: string;
};

if (!requestId) {
  return NextResponse.json(
    { error: "requestId ontbreekt" },
    { status: 400 }
  );
}

/* ===============================
   ADMIN AUTH CHECK
=============================== */

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name) {
        return req.cookies.get(name)?.value;
      },
    },
  }
);

const {
  data: { user: adminUser },
} = await supabase.auth.getUser();

if (!adminUser) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

const { data: profile, error: profileError } = await supabaseAdmin
  .from("profiles")
  .select("role")
  .eq("user_id", adminUser.id)
  .single();

if (profileError || !profile || profile.role !== "admin") {
  return NextResponse.json(
    { error: "Admin only" },
    { status: 403 }
  );
}

    /* ======================================================
       1. Signup request ophalen
       ====================================================== */
    const { data: signupData, error: signupError } = await supabaseAdmin
      .from("club_signup_requests")
      .select(`
  id,
  club_name,
  contact_name,
  email,
  phone,
  status,
  selected_package
`)
      .eq("id", requestId)
      .single();

    if (signupError || !signupData) {
      return NextResponse.json(
        { error: "Aanvraag niet gevonden" },
        { status: 404 }
      );
    }

    const signup = signupData as SignupRequest;
    console.log("✅ signup gevonden:", signup);

    if (signup.status !== "pending") {
      return NextResponse.json(
        { error: "Aanvraag is al verwerkt" },
        { status: 400 }
      );
    }

    const email = signup.email.toLowerCase();

    /* ===============================
   2. Auth user ophalen of aanmaken (TS-safe)
   =============================== */
const usersRes = await supabaseAdmin.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});

if (usersRes.error || !usersRes.data) {
  return NextResponse.json(
    { error: "Gebruikers ophalen mislukt" },
    { status: 500 }
  );
}

// 🔐 EXPLICIET TYPEN (DIT LOST DE NEVER-ERROR OP)
const users: User[] = usersRes.data.users;

let user: User | null =
  users.find(
    (u: User) => u.email?.toLowerCase() === email
  ) ?? null;

if (!user) {
  const createRes =
    await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
    });

  if (createRes.error || !createRes.data?.user) {
    return NextResponse.json(
      { error: "Auth user aanmaken mislukt" },
      { status: 500 }
    );
  }

  user = createRes.data.user;
}

console.log("✅ auth user:", user.id, user.email);

    /* ======================================================
       3. Club aanmaken
       ====================================================== */
    let slug = generateSlug(signup.club_name);

    const { data: slugExists } = await supabaseAdmin
      .from("clubs")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }

    const { data: club, error: clubError } = await supabaseAdmin
  .from("clubs")
  .insert({
    name: signup.club_name,
    slug,
    public_slug: slug,
    email,
    contact_name: signup.contact_name,
    contact_email: signup.email,
    contact_phone: signup.phone,
    status: "approved",
    owner_id: user.id,
    approved_at: new Date().toISOString(),
    subscription_package: signup.selected_package,
    active_package: signup.selected_package,
    current_plan: signup.selected_package,
    pending_package: signup.selected_package,
  })
  .select("id")
  .single();

    if (clubError || !club) {
      return NextResponse.json(
        { error: "Club aanmaken mislukt" },
        { status: 500 }
      );
    }

    const clubId = club.id;
    console.log("✅ club aangemaakt:", clubId);

    /* ===============================
   4. Profiel koppelen (FK-veilig)
   =============================== */

// check op PRIMARY KEY (id)
const profileCheck = await supabaseAdmin
  .from("profiles")
  .select("id")
  .eq("id", user.id)
  .maybeSingle();

if (profileCheck.error) {
  console.error("❌ profiel check error:", profileCheck.error);
  return NextResponse.json(
    { error: "Profiel check mislukt" },
    { status: 500 }
  );
}

if (profileCheck.data) {
  // UPDATE bestaand profiel
  const updateProfile = await supabaseAdmin
    .from("profiles")
    .update({
      email,
      role: "club",
      club_id: clubId,
    })
    .eq("id", user.id);

  if (updateProfile.error) {
    console.error("❌ profiel update error:", updateProfile.error);
    return NextResponse.json(
      { error: "Profiel bijwerken mislukt" },
      { status: 500 }
    );
  }

  console.log("✅ profiel geüpdatet");
} else {
  // INSERT nieuw profiel (FK klopt nu)
  const insertProfile = await supabaseAdmin
    .from("profiles")
    .insert({
      id: user.id,          // 🔑 FK → auth.users.id
      user_id: user.id,     // (optioneel, maar consistent)
      email,
      role: "club",
      club_id: clubId,
    });

  if (insertProfile.error) {
    console.error("❌ profiel insert error:", insertProfile.error);
    return NextResponse.json(
      { error: "Profiel aanmaken mislukt" },
      { status: 500 }
    );
  }

  console.log("✅ profiel aangemaakt");
}

    /* ======================================================
       5. Signup request afronden + token
       ====================================================== */
    const token = crypto.randomUUID();

    const { error: updateReqError } = await supabaseAdmin
      .from("club_signup_requests")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
        club_id: clubId,
        token,
      })
      .eq("id", signup.id);

    if (updateReqError) {
      return NextResponse.json(
        { error: "Signup afronden mislukt" },
        { status: 500 }
      );
    }

    /* ======================================================
       6. Activatiemail
       ====================================================== */
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const claimUrl = `${baseUrl}/onboarding/claim?token=${token}`;

    console.log("📧 mail versturen naar:", email);

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: [email],
      subject: `Je club ${signup.club_name} is goedgekeurd`,
      html: `
        <p>Goed nieuws!</p>
        <p>Jullie club <strong>${signup.club_name}</strong> is goedgekeurd.</p>
        <p>
          <a href="${claimUrl}">
            Activeer je club
          </a>
        </p>
        <p>Sportieve groet,<br/>Sponsorjobs</p>
      `,
    });


    console.log("✅ approve-club DONE");

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("❌ approve-club HARD FAIL:", err);
    console.error(err?.stack);

    return NextResponse.json(
      { error: "Goedkeuren mislukt", message: err?.message },
      { status: 500 }
    );
  }
}
