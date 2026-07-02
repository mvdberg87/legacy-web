import type {
  DiscoverySignal,
} from "./types";

export function buildSignals(
  club: any
): DiscoverySignal[] {

  return [

    {

      name: "pageviews",

      value: club.pageviews,

    },

    {

      name: "clicks",

      value: club.totalClicks,

    },

    {

      name: "shares",

      value: club.totalShares,

    },

    {

      name: "jobs",

      value: club.activeJobs,

    },

  ];

}