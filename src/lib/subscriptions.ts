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
    priceId?: string; // 👈 TOEVOEGEN (optioneel voor basic)
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
  ads: 1,
  vacancies: 5,
  pricePerMonth: 49,
  upgradeOnly: true,
  priceId: "price_1TCb6s1wwCgXLwCDtmGRVw1y", // 👈 HIER
},

  pro: {
  label: "Pro",
  durationMonths: 12,
  ads: 3,
  vacancies: 15,
  pricePerMonth: 79,
  upgradeOnly: true,
  priceId: "price_1TCb7E1wwCgXLwCDA4vQFvOL",
},

  unlimited: {
  label: "Unlimited",
  durationMonths: 12,
  ads: 5, // 🔥 VAN Infinity → 5
  vacancies: Infinity,
  pricePerMonth: 99,
  upgradeOnly: true,
},
};
