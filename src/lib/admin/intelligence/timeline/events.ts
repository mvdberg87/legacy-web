import type {
  TimelineEvent,
} from "./types";

export function buildTimelineEvents(): TimelineEvent[] {

  return [

    {
      id: "1",
      time: "09:14",
      title: "Nieuwe commerciële kans",
      description: "VV Naaldwijk voldoet aan meerdere upgrade-indicatoren.",
      icon: "🟢",
      color: "green",
    },

    {
      id: "2",
      time: "09:43",
      title: "Advertentie verkocht",
      description: "Een Premium advertentie is succesvol geplaatst.",
      icon: "💰",
      color: "yellow",
    },

    {
      id: "3",
      time: "10:12",
      title: "Benchmark bijgewerkt",
      description: "De nieuwste platformvergelijking is verwerkt.",
      icon: "📈",
      color: "blue",
    },

    {
      id: "4",
      time: "11:28",
      title: "Nieuwe AI-prioriteit",
      description: "De Action Engine heeft de prioriteiten opnieuw berekend.",
      icon: "🤖",
      color: "purple",
    },

  ];

}