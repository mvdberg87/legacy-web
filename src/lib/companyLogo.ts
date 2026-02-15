// src/lib/companyLogo.ts

export function getCompanyLogo(
  website?: string | null,
  cachedLogo?: string | null
) {
  // 1️⃣ Gebruik gecachet logo (beste kwaliteit)
  if (cachedLogo) return cachedLogo;

  // 2️⃣ Geen website → lokale placeholder
  if (!website) return "/placeholder-logo.svg";

  try {
    const domain = new URL(website).hostname.replace(/^www\./, "");

    // 3️⃣ Clearbit (merklogo, premium)
    return `https://logo.clearbit.com/${domain}`;
  } catch {
    return "/placeholder-logo.svg";
  }
}

/**
 * ⚠️ Favicon fallback wordt in de UI gebruikt
 * als Clearbit geen logo toont (img onError)
 */
export function getFaviconFallback(website?: string | null) {
  if (!website) return "/placeholder-logo.svg";

  try {
    const domain = new URL(website).hostname.replace(/^www\./, "");
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return "/placeholder-logo.svg";
  }
}
