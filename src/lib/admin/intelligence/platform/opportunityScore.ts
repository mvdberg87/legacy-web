export type OpportunityClub = {
  id: string;
  name: string;

  activeJobs: number;
  pageviews: number;
  totalClicks: number;
  totalShares: number;
};

export type UpgradeOpportunity = {
  clubId: string;
  clubName: string;

  score: number;

  reason: string;
};

export function calculateUpgradeOpportunities(
  clubs: OpportunityClub[]
): UpgradeOpportunity[] {

  return clubs
    .map((club) => {

      let score = 0;

      if (club.activeJobs >= 5)
        score += 30;

      if (club.pageviews >= 100)
        score += 25;

      if (club.totalClicks >= 40)
        score += 25;

      if (club.totalShares >= 10)
        score += 20;

      return {

        clubId: club.id,

        clubName: club.name,

        score,

        reason:
          "Gebaseerd op activiteit, bereik en engagement.",

      };

    })

    .sort(
      (a, b) =>
        b.score - a.score
    );

}