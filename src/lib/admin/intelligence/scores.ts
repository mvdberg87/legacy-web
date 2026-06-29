/**
 * ============================================================
 * Sponsorjobs Intelligence
 * Scores Engine
 * ------------------------------------------------------------
 * Centrale berekeningen voor alle scores binnen Sponsorjobs.
 *
 * LET OP:
 * Dit bestand bevat GEEN database-calls.
 * Alleen pure berekeningen.
 * ============================================================
 */

export type ClubMetrics = {
  activeJobs?: number;
  pageviews?: number;
  totalClicks?: number;
  totalShares?: number;
  isActive?: boolean;
};

export type ScoreResult = {
  score: number;
  label: string;
  color:
    | "green"
    | "blue"
    | "yellow"
    | "orange"
    | "red";
};

/* ============================================================
   Helpers
============================================================ */

export function calculateCTR(
  clicks = 0,
  pageviews = 0
): number {
  if (pageviews === 0) return 0;

  return Number(((clicks / pageviews) * 100).toFixed(1));
}

export function calculateShareRate(
  shares = 0,
  pageviews = 0
): number {
  if (pageviews === 0) return 0;

  return Number(((shares / pageviews) * 100).toFixed(1));
}

/* ============================================================
   Health Score
============================================================ */

export function calculateHealthScore(
  metrics: ClubMetrics
): ScoreResult {
  let score = 0;

  const ctr = calculateCTR(
    metrics.totalClicks,
    metrics.pageviews
  );

  const shareRate = calculateShareRate(
    metrics.totalShares,
    metrics.pageviews
  );

  if ((metrics.activeJobs ?? 0) >= 5) score += 25;
  else if ((metrics.activeJobs ?? 0) >= 3) score += 15;
  else if ((metrics.activeJobs ?? 0) >= 1) score += 5;

  if ((metrics.pageviews ?? 0) >= 500) score += 20;
  else if ((metrics.pageviews ?? 0) >= 100) score += 10;

  if (ctr >= 8) score += 25;
  else if (ctr >= 5) score += 15;
  else if (ctr >= 3) score += 5;

  if (shareRate >= 5) score += 20;
  else if (shareRate >= 2) score += 10;

  if (metrics.isActive) score += 10;

  return scoreToResult(score);
}

/* ============================================================
   Growth Score
============================================================ */

export function calculateGrowthScore(
  metrics: ClubMetrics
): ScoreResult {

  let score = 0;

  const ctr = calculateCTR(
    metrics.totalClicks,
    metrics.pageviews
  );

  if ((metrics.activeJobs ?? 0) >= 5) score += 30;
  if ((metrics.pageviews ?? 0) >= 250) score += 25;
  if (ctr >= 5) score += 25;
  if ((metrics.totalShares ?? 0) >= 5) score += 20;

  return scoreToResult(score);
}

/* ============================================================
   Opportunity Score
============================================================ */

export function calculateOpportunityScore(
  metrics: ClubMetrics
): ScoreResult {

  let score = 100;

  if ((metrics.activeJobs ?? 0) >= 5) score -= 25;
  if ((metrics.pageviews ?? 0) >= 250) score -= 25;
  if ((metrics.totalShares ?? 0) >= 5) score -= 25;
  if ((metrics.totalClicks ?? 0) >= 50) score -= 25;

  score = Math.max(score, 0);

  return scoreToResult(score);
}

/* ============================================================
   Platform Intelligence Score
============================================================ */

export function calculateIntelligenceScore(
  healthScores: number[]
): number {

  if (healthScores.length === 0) return 0;

  const avg =
    healthScores.reduce(
      (sum, score) => sum + score,
      0
    ) / healthScores.length;

  return Math.round(avg);
}

/* ============================================================
   Shared mapper
============================================================ */

function scoreToResult(
  score: number
): ScoreResult {

  if (score >= 85) {
    return {
      score,
      label: "Excellent",
      color: "green",
    };
  }

  if (score >= 70) {
    return {
      score,
      label: "Healthy",
      color: "blue",
    };
  }

  if (score >= 50) {
    return {
      score,
      label: "Needs attention",
      color: "yellow",
    };
  }

  if (score >= 30) {
    return {
      score,
      label: "At risk",
      color: "orange",
    };
  }

  return {
    score,
    label: "Critical",
    color: "red",
  };
}