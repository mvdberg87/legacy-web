export type TimelineEvent = {

  id: string;

  time: string;

  title: string;

  description: string;

  icon: string;

  color: string;

};

export type TimelineDashboard = {

  events: TimelineEvent[];

};