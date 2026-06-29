export type ExecutiveClub = {
  id: string;
  slug: string;
  name: string;

  active_package: string | null;
  subscription_status: string | null;

  status: string | null;

  active_jobs: number;

  total_clicks: number;

  total_shares: number;

  pageviews: number;
};

export type ExecutiveSubscription = {
  id: string;

  amount: number;

  status: string;

  created_at: string;
};

export type ExecutiveAdvertisement = {
  id: string;

  club_name: string;

  amount: number;

  club_amount: number;

  platform_amount: number;
};

export type ExecutiveData = {

  clubs: ExecutiveClub[];

  subscriptions: ExecutiveSubscription[];

  advertisements: ExecutiveAdvertisement[];

};