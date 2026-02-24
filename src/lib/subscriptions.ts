export type PackageKey = "basic" | "plus" | "pro" | "unlimited";

export const SUBSCRIPTIONS: Record<
  PackageKey,
  {
    label: string;
    durationMonths: number;
    ads: number;
    vacancies: number;
    pricePerMonth: number;
    upgradeOnly: boolean;
  }
> = {
  basic: {
    label: "Basic",
    durationMonths: 12,
    ads: 0,                // ❌ Geen advertenties
    vacancies: 1,
    pricePerMonth: 0,
    upgradeOnly: true,
  },

  plus: {
    label: "Plus",
    durationMonths: 12,
    ads: 1,                // ✅ 1 advertentie
    vacancies: 5,
    pricePerMonth: 49,
    upgradeOnly: true,
  },

  pro: {
    label: "Pro",
    durationMonths: 12,
    ads: 3,                // ✅ 3 advertenties
    vacancies: 15,
    pricePerMonth: 79,
    upgradeOnly: true,
  },

  unlimited: {
    label: "Unlimited",
    durationMonths: 12,
    ads: Number.POSITIVE_INFINITY,  // ✅ Ongelimiteerd (veiliger dan Infinity)
    vacancies: Number.POSITIVE_INFINITY,
    pricePerMonth: 99,
    upgradeOnly: true,
  },
};
