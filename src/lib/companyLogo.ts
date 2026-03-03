// src/lib/companyLogo.ts

function extractDomain(input?: string | null): string | null {
  if (!input) return null;

  try {
    const normalized = input.startsWith("http")
      ? input
      : `https://${input}`;

    const hostname = new URL(normalized).hostname;

    return hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function getCompanyLogo(
  website?: string | null,
  cachedLogo?: string | null
) {
  // 1️⃣ Gebruik gecachet logo (beste kwaliteit)
  if (cachedLogo) return cachedLogo;

  const domain = extractDomain(website);
  if (!domain) return "/placeholder-logo.svg";

  // 2️⃣ Clearbit merklogo
  return `https://logo.clearbit.com/${domain}`;
}

/**
 * ⚠️ Favicon fallback wordt gebruikt als Clearbit faalt
 */
export function getFaviconFallback(website?: string | null) {
  const domain = extractDomain(website);
  if (!domain) return "/placeholder-logo.svg";

  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}