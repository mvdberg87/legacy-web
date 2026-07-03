import type {
  TimelineEvent,
} from "./types";

export function buildTimelineEvents(): TimelineEvent[] {

  return [

    {

      id: "1",

      time: "09:15",

      title:
        "Nieuwe upgradekans",

      description:
        "VV Naaldwijk heeft nu 96% upgradekans.",

      type: "Discovery",

    },

    {

      id: "2",

      time: "10:03",

      title:
        "Nieuwe MRR",

      description:
        "€49 extra maandelijkse omzet.",

      type: "Revenue",

    },

    {

      id: "3",

      time: "11:42",

      title:
        "Benchmark gewijzigd",

      description:
        "FC 's-Gravenzande behoort nu tot de top 5%.",

      type: "Learning",

    },

  ];

}