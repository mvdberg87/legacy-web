"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getCompanyLogo,
  getFaviconFallback,
} from "@/lib/companyLogo";

/* ---------- Types ---------- */

type Props = {
  href: string;
  title: string;
  company: string;
  website?: string | null;
  cachedLogo?: string | null;
  external?: boolean;
  variant?: "default" | "ad";   // 👈 toevoegen
};

/* ---------- Component ---------- */

export default function ListingCard({
  href,
  title,
  company,
  website,
  cachedLogo,
  external = false,
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
      <div className="mt-6">
        <button
          onClick={handlePrimaryClick}
          disabled={!isValidHref}
          className="
            rounded-xl px-6 py-2 text-sm font-semibold transition
            bg-[#1f9d55] text-white
            hover:bg-[#15803d]
            disabled:bg-gray-300 disabled:text-gray-500
          "
        >
          Meer info &amp; solliciteren
        </button>
      </div>
    </div>
  );
}
