"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getCompanyLogo,
  getFaviconFallback,
} from "@/lib/companyLogo";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

/* ---------- Types ---------- */

type Props = {
  href: string;
  title: string;
  company: string;
  website?: string | null;
  cachedLogo?: string | null;
  jobId: string;
  clubId: string;
  external?: boolean;
  variant?: "default" | "ad";
};

/* ---------- Component ---------- */

export default function ListingCard({
  href,
  title,
  company,
  website,
  cachedLogo,
  jobId,
  clubId,
  external = false,
}: Props) {
  const router = useRouter();
const supabase = getSupabaseBrowser();
  const logoSrc = getCompanyLogo(website, cachedLogo);

  const isValidHref =
    typeof href === "string" && href.trim().startsWith("http");

  function handlePrimaryClick() {
  if (!isValidHref) return;

  if (external) {
    window.open(href, "_blank", "noopener,noreferrer");
  } else {
    router.push(href);
  }
}

/* =========================
   WhatsApp share
========================= */
async function shareInTeamApp() {
  if (!isValidHref) return;

  const text = `Vacature bij ${company}

${title}

Bekijk deze vacature via Sponsorjobs:
${href}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

  /* =========================
     SHARE TRACKING
  ========================= */

  try {
    await supabase.from("job_shares").insert({
  job_id: jobId,
  club_id: clubId,
  platform: "whatsapp",
});
  } catch (err) {
    console.error("Share tracking error:", err);
  }

  window.open(whatsappUrl, "_blank");
}

  return (
    <div
      className="
        group rounded-2xl border-2 border-white
        bg-[#0d1b2a]
        p-6 transition-all duration-200
        hover:bg-white hover:shadow-xl
      "
    >
      {/* ---------- Header ---------- */}
      <div className="flex items-center gap-4">
        <Image
          src={logoSrc}
          alt={company}
          width={56}
          height={56}
          className="h-14 w-14 rounded-xl border bg-white object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              getFaviconFallback(website);
          }}
        />

        <div className="flex-1 min-w-0">
          <h3
            className="
              text-lg font-semibold truncate
              text-white
              group-hover:text-[#0d1b2a]
            "
          >
            {title}
          </h3>
          <p
            className="
              text-sm truncate
              text-gray-200
              group-hover:text-gray-600
            "
          >
            {company}
          </p>
        </div>
      </div>

      {/* ---------- CTA ---------- */}
<div className="mt-6 flex gap-3">

  <button
  onClick={handlePrimaryClick}
  disabled={!isValidHref}
  className="
    flex-1
    rounded-xl py-2 text-sm font-semibold transition
    bg-[#1f9d55] text-white
    hover:bg-[#15803d]
    disabled:bg-gray-300 disabled:text-gray-500
  "
>
  Meer info &amp; solliciteren
</button>

  <button
  onClick={(e) => {
    e.stopPropagation();
    shareInTeamApp();
  }}
  className="
    flex-1
    rounded-xl py-2 text-sm font-semibold
    border border-[#FFFFFF]
    text-[#1f9d55]
    hover:bg-[#1f9d55] hover:text-white
    transition
  "
>
  📲 Deel vacature
</button>

</div>

</div>
  );
}