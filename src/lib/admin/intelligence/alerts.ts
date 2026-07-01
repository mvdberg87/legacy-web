/**
 * ============================================================
 * Sponsorjobs Executive Intelligence
 * Alerts Engine
 * ------------------------------------------------------------
 * Genereert automatisch alerts en kansen op basis
 * van platformdata.
 * ============================================================
 */

import type { BenchmarkClub } from "./benchmarks";
import {
  calculateCTR,
  calculateShareRate,
} from "./scores";
import type { ExecutiveAlert } from "./types";

export function generateAlerts(
  clubs: BenchmarkClub[]
): ExecutiveAlert[] {

  const alerts: ExecutiveAlert[] = [];

  const inactiveClubs = clubs.filter(
    (club) => club.activeJobs === 0
  );

  if (inactiveClubs.length > 0) {
    alerts.push({
  severity: "warning",
  category: "activation",

  title: `${inactiveClubs.length} clubs zonder vacatures`,

  description:
    "Deze clubs halen momenteel weinig waarde uit Sponsorjobs.",

  action:
    "Neem contact op en help de eerste vacatures online zetten.",

  confidence: 98,
});
  }

  const lowTraffic = clubs.filter(
    (club) => club.pageviews < 25
  );

  if (lowTraffic.length > 0) {
    alerts.push({
  severity: "warning",
  category: "growth",

  title: `${lowTraffic.length} clubs met weinig bereik`,

  description:
    "Deze clubs hebben minder dan 25 pageviews.",

  action:
    "Stimuleer social sharing of plaats extra vacatures.",

  confidence: 92,
});
  }

  const highCTR = clubs.filter((club) => {
    const ctr = calculateCTR(
      club.totalClicks,
      club.pageviews
    );

    return ctr >= 8;
  });

  if (highCTR.length > 0) {
    alerts.push({
  severity: "success",
  category: "platform",

  title: `${highCTR.length} clubs presteren bovengemiddeld`,

  description:
    "Deze clubs behalen een uitzonderlijk hoge CTR.",

  action:
    "Onderzoek welke factoren bijdragen aan dit succes.",

  confidence: 95,
});
  }

  const lowShareRate = clubs.filter((club) => {
    const shareRate = calculateShareRate(
      club.totalShares,
      club.pageviews
    );

    return shareRate < 1;
  });

  if (lowShareRate.length > 0) {
    alerts.push({
  severity: "info",
  category: "growth",

  title: `${lowShareRate.length} clubs delen nauwelijks vacatures`,

  description:
    "Een lage share rate beperkt het organisch bereik.",

  action:
    "Adviseer clubs om vacatures via LinkedIn en social media te delen.",

  confidence: 90,
});
  }

  return alerts;
}