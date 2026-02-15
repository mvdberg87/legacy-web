export type PackageKey = "basic" | "plus" | "pro" | "unlimited";

export const PACKAGE_LIMITS: Record<
  PackageKey,
  { maxAds: number }
> = {
  basic: { maxAds: 0 },
  plus: { maxAds: 3 },
  pro: { maxAds: 10 },
  unlimited: { maxAds: Infinity },
};
