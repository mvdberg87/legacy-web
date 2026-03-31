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
    priceId?: string;
  }
> = {
  basic: {
    label: "Basic",
    durationMonths: 12,
    ads: 0,
    vacancies: 10, // 🔥 aangepast
    pricePerMonth: 0,
    upgradeOnly: true,
  },

  plus: {
    label: "Plus",
    durationMonths: 12,
    ads: 1,
    vacancies: 25, // 🔥 aangepast
    pricePerMonth: 49,
    upgradeOnly: true,
    priceId: "price_1TCb6s1wwCgXLwCDtmGRVw1y",
  },

  pro: {
    label: "Pro",
    durationMonths: 12,
    ads: 3,
    vacancies: 50, // 🔥 aangepast
    pricePerMonth: 79,
    upgradeOnly: true,
    priceId: "price_1TCb7E1wwCgXLwCDA4vQFvOL",
  },

  unlimited: {
    label: "Unlimited",
    durationMonths: 12,
    ads: 5,
    vacancies: 100, // 🔥 aangepast (geen Infinity meer)
    pricePerMonth: 99,
    upgradeOnly: true,
  },
};