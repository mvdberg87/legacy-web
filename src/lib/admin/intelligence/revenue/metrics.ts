import { SUBSCRIPTIONS } from "@/lib/subscriptions";

export type RevenueClub = {
  active_package: "basic" | "plus" | "pro" | "unlimited";
  subscription_status: string | null;
  subscription_start: string | null;
  subscription_end: string | null;
  subscription_cancelled_at?: string | null;
};

export type RevenueAdvertisement = {
  amount?: number | null;
  club_amount?: number | null;
  platform_amount?: number | null;
  deleted_at?: string | null;
};

export type RevenueMetrics = {
  mrr: number;
  arr: number;
  arpu: number;

  churnRate: number;
  nrr: number;
  ltv: string;

  conversionRate: number;
  pendingCancellation: number;

  totalAdRevenue: number;
  totalClubShare: number;
  totalSponsulsShare: number;
  totalPlatformRevenue: number;

  activeAds: number;
};

export function calculateRevenueMetrics(
  clubs: RevenueClub[],
  advertisements: RevenueAdvertisement[]
): RevenueMetrics {

  const paidClubs = clubs.filter(
    (club) =>
      club.active_package !== "basic" &&
      club.subscription_status === "active" &&
      !club.subscription_cancelled_at
  );

  const cancelledClubs = clubs.filter(
    (club) => club.subscription_cancelled_at
  );

  const mrr = paidClubs.reduce(
    (sum, club) =>
      sum +
      SUBSCRIPTIONS[club.active_package].pricePerMonth,
    0
  );

  const arr = mrr * 12;

  const arpu =
    paidClubs.length > 0
      ? mrr / paidClubs.length
      : 0;

  const totalPaidCustomers =
    paidClubs.length +
    cancelledClubs.length;

  const churnRate =
    totalPaidCustomers > 0
      ? (cancelledClubs.length /
          totalPaidCustomers) *
        100
      : 0;

  const expansionRevenue = 0;

  const revenueLost =
    cancelledClubs.reduce(
      (sum, club) =>
        sum +
        (club.active_package !== "basic"
          ? SUBSCRIPTIONS[
              club.active_package
            ].pricePerMonth
          : 0),
      0
    );

  const nrr =
    mrr > 0
      ? ((mrr +
          expansionRevenue -
          revenueLost) /
          mrr) *
        100
      : 100;

  const ltv =
    churnRate > 0
      ? (
          arpu /
          (churnRate / 100)
        ).toFixed(0)
      : "∞";

  const conversionRate =
  clubs.length > 0
    ? Number(
        (
          (paidClubs.length /
            clubs.length) *
          100
        ).toFixed(1)
      )
    : 0;

  const pendingCancellation =
    cancelledClubs.length;

  const totalAdRevenue =
    advertisements.reduce(
      (sum, row) =>
        sum + (row.amount || 0),
      0
    );

  const totalClubShare =
    advertisements.reduce(
      (sum, row) =>
        sum +
        (row.club_amount || 0),
      0
    );

  const totalSponsulsShare =
    advertisements.reduce(
      (sum, row) =>
        sum +
        (row.platform_amount || 0),
      0
    );

  const activeAds =
    advertisements.filter(
      (row) => !row.deleted_at
    ).length;

  const totalPlatformRevenue =
    mrr +
    totalSponsulsShare;

  return {

    mrr,

    arr,

    arpu,

    churnRate,

    nrr,

    ltv,

    conversionRate,

    pendingCancellation,

    totalAdRevenue,

    totalClubShare,

    totalSponsulsShare,

    totalPlatformRevenue,

    activeAds,

  };

}