// lib/permissions.ts
import { SUBSCRIPTIONS, type PackageKey } from "@/lib/subscriptions";

export function canCreateAd({
  activePackage,
  currentAds,
  adminOverride = false,
}: {
  activePackage: PackageKey;
  currentAds: number;
  adminOverride?: boolean;
}) {
  if (adminOverride) return true;

  const maxAds = SUBSCRIPTIONS[activePackage].ads;

  if (maxAds === Infinity) return true;
  return currentAds < maxAds;
}
