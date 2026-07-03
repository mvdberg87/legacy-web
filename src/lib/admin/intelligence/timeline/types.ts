export type TimelineEvent = {

  id: string;

  time: string;

  title: string;

  description: string;

  type:
    | "Discovery"
    | "Revenue"
    | "Learning"
    | "Prediction"
    | "Action";

};

export type TimelineDashboard = {

  events: TimelineEvent[];

};