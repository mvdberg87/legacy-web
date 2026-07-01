import { SUBSCRIPTIONS } from "@/lib/subscriptions";
import type {
  RevenueAdvertisement,
  RevenueClub,
} from "./metrics";

export type RevenueCharts = {

  funnelData: {
    stage: string;
    value: number;
  }[];

  cohortData: {
    month: string;
    value: number;
  }[];

  mrrChartData: {
    month: string;
    value: number;
  }[];

  clubGrowthData: {
    month: string;
    value: number;
  }[];

  adRevenueByClub: Record<
    string,
    {
      revenue: number;
      clubAmount: number;
      platformAmount: number;
    }
  >;

};

export function calculateRevenueCharts(
  clubs: RevenueClub[],
  advertisements: RevenueAdvertisement[]
): RevenueCharts {

  /*
   * Paid clubs
   */

  const paidClubs = clubs.filter(
    (club) =>
      club.active_package !== "basic" &&
      club.subscription_status === "active" &&
      !club.subscription_cancelled_at
  );

  /*
   * Upgrade Funnel
   */

  const funnelData = [

    {
      stage: "Basic",
      value: clubs.filter(
        c => c.active_package === "basic"
      ).length,
    },

    {
      stage: "Plus",
      value: clubs.filter(
        c => c.active_package === "plus"
      ).length,
    },

    {
      stage: "Pro",
      value: clubs.filter(
        c => c.active_package === "pro"
      ).length,
    },

    {
      stage: "Unlimited",
      value: clubs.filter(
        c => c.active_package === "unlimited"
      ).length,
    },

  ];

  /*
   * Cohort
   */

  const cohorts: Record<string, number> = {};

  paidClubs.forEach((club) => {

    if (!club.subscription_start) return;

    const date =
      new Date(club.subscription_start);

    const key =
      `${date.getFullYear()}-${date.getMonth() + 1}`;

    cohorts[key] =
      (cohorts[key] ?? 0) + 1;

  });

  const cohortData =
    Object.entries(cohorts).map(
      ([month, value]) => ({
        month,
        value,
      })
    );

  /*
   * Rolling MRR
   */

  const mrrByMonth: Record<string, number> = {};

  paidClubs.forEach((club) => {

    if (!club.subscription_start) return;

    const date =
      new Date(club.subscription_start);

    const key =
      `${date.getFullYear()}-${date.getMonth() + 1}`;

    mrrByMonth[key] =
      (mrrByMonth[key] ?? 0) +
      SUBSCRIPTIONS[
        club.active_package
      ].pricePerMonth;

  });

  const mrrChartData =
    Object.entries(mrrByMonth).map(
      ([month, value]) => ({
        month,
        value,
      })
    );

  /*
   * Club Growth
   */

  const growth: Record<string, number> = {};

  clubs.forEach((club) => {

    if (!club.subscription_start) return;

    const date =
      new Date(club.subscription_start);

    const key =
      `${date.getFullYear()}-${date.getMonth() + 1}`;

    growth[key] =
      (growth[key] ?? 0) + 1;

  });

  const clubGrowthData =
    Object.entries(growth).map(
      ([month, value]) => ({
        month,
        value,
      })
    );

  /*
   * Advertentie omzet
   */

  const adRevenueByClub =
    advertisements.reduce(

      (acc, row: any) => {

        const club =
          row.club_name ??
          "Onbekend";

        if (!acc[club]) {

          acc[club] = {

            revenue: 0,

            clubAmount: 0,

            platformAmount: 0,

          };

        }

        acc[club].revenue +=
          row.amount ?? 0;

        acc[club].clubAmount +=
          row.club_amount ?? 0;

        acc[club].platformAmount +=
          row.platform_amount ?? 0;

        return acc;

      },

      {} as RevenueCharts["adRevenueByClub"]

    );

  return {

    funnelData,

    cohortData,

    mrrChartData,

    clubGrowthData,

    adRevenueByClub,

  };

}