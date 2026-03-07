// src/lib/companyLogo.ts

function extractDomain(input?: string | null): string | null {
  if (!input) return null;

  try {
    let normalized = input.trim();

    // 🔧 protocol toevoegen als het ontbreekt
    if (!normalized.startsWith("http")) {
      normalized = "https://" + normalized;
    }

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
  // 1️⃣ eerst gecachet logo gebruiken
  if (cachedLogo) return cachedLogo;

  const domain = extractDomain(website);

  if (!domain) return "/placeholder-logo.svg";

  // 2️⃣ Clearbit bedrijfslogo (beste kwaliteit)
  return `https://logo.clearbit.com/${domain}`;
}

/**
 * Favicon fallback wanneer Clearbit geen logo heeft
 */
export function getFaviconFallback(website?: string | null) {
  const domain = extractDomain(website);

  if (!domain) return "/placeholder-logo.svg";

  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}