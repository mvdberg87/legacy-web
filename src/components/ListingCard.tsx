"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getCompanyLogo,
  getFaviconFallback,
} from "@/lib/companyLogo";
import { FaWhatsapp } from "react-icons/fa";

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
  onShare?: () => void;
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
  onShare,
}: Props) {
  const router = useRouter();
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
function shareInTeamApp() {
  if (!isValidHref) return;

  const text = `Vacature bij ${company}

${title}

Bekijk deze vacature via ${window.location.host}:
${href}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
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

        <div className="flex-1">
          <h3
  className="
    text-base sm:text-lg font-semibold leading-snug
    text-white
    group-hover:text-[#0d1b2a]
    line-clamp-2
  "
>
            {title}
          </h3>
          <p
  className="
    text-sm
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

  onShare?.(); // 🔥 eerst tracking

  setTimeout(() => {
    shareInTeamApp(); // 🔥 daarna pas openen
  }, 200); // iets ruimer voor zekerheid
}}
  className="
    flex-1
    flex items-center justify-center gap-2
    rounded-xl py-2 text-sm font-semibold
    border border-white
    text-[#25D366]
    hover:bg-[#25D366] hover:text-white
    transition
  "
>
  <FaWhatsapp className="text-lg" />
  Deel vacature
</button>

</div>

</div>
  );
}