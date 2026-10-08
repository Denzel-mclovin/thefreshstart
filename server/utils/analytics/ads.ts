// server/utils/analytics/ads.ts
//
// ТЗ 4.1. Cost-per-call считается только по trafficSource = PAID, никогда
// total-spend / total-calls. Пока нет и AdInsight, и лидов с trafficSource —
// возвращает { available: false } вместо неверного числа.

import { prisma } from "../prisma";
import { Granularity, truncUnit, intervalStep } from "./query-helpers";

interface RawRow {
  bucket: Date;
  paidBookedCalls: number;
  paidAttendedCalls: number;
  adSpendCents: number;
}

export interface CostPerCallRow {
  period: string;
  adSpend: number;
  paidBookedCalls: number;
  paidAttendedCalls: number;
  costPerBookedCall: number | null;
  costPerAttendedCall: number | null;
}

export interface CostPerCallResult {
  available: boolean;
  reason?: string;
  rows: CostPerCallRow[];
}

export async function getCostPerCall(from: Date, to: Date, granularity: Granularity): Promise<CostPerCallResult> {
  const [hasSpend, hasPaidLeads] = await Promise.all([
    prisma.adInsight.count({ where: { date: { gte: from, lte: to } } }),
    prisma.lead.count({ where: { trafficSource: "PAID" } }),
  ]);

  if (hasSpend === 0) {
    return { available: false, reason: "No AdInsight rows for this range yet — run /api/meta/sync first.", rows: [] };
  }
  if (hasPaidLeads === 0) {
    return {
      available: false,
      reason: 'No leads are tagged trafficSource = "PAID" yet — run the attribution backfill before trusting this metric.',
      rows: [],
    };
  }

  const trunc = truncUnit(granularity);
  const step = intervalStep(granularity);

  const rows = await prisma.$queryRaw<RawRow[]>`
    WITH periods AS (
      SELECT generate_series(date_trunc(${trunc}, ${from}::timestamp), date_trunc(${trunc}, ${to}::timestamp), ${step}) AS bucket
    ),
    booked AS (
      SELECT date_trunc(${trunc}, "bookingMadeAt") AS bucket, COUNT(*)::int AS n
      FROM leads
      WHERE "bookingMadeAt" BETWEEN ${from} AND ${to} AND "trafficSource" = 'PAID'
      GROUP BY 1
    ),
    attended AS (
      SELECT date_trunc(${trunc}, "callOutcomeAt") AS bucket, COUNT(*)::int AS n
      FROM leads
      WHERE "callOutcomeAt" BETWEEN ${from} AND ${to}
        AND "trafficSource" = 'PAID'
        AND status NOT IN ('NO_SHOW', 'CANCELLED', 'RESCHEDULED')
      GROUP BY 1
    ),
    spend AS (
      SELECT date_trunc(${trunc}, "date") AS bucket, SUM("spend")::int AS cents
      FROM ad_insights WHERE "date" BETWEEN ${from} AND ${to} GROUP BY 1
    )
    SELECT
      periods.bucket AS bucket,
      COALESCE(booked.n, 0) AS "paidBookedCalls",
      COALESCE(attended.n, 0) AS "paidAttendedCalls",
      COALESCE(spend.cents, 0) AS "adSpendCents"
    FROM periods
    LEFT JOIN booked ON booked.bucket = periods.bucket
    LEFT JOIN attended ON attended.bucket = periods.bucket
    LEFT JOIN spend ON spend.bucket = periods.bucket
    ORDER BY periods.bucket;
  `;

  return {
    available: true,
    rows: rows.map((r) => {
      const adSpend = r.adSpendCents / 100;
      return {
        period: r.bucket.toISOString(),
        adSpend,
        paidBookedCalls: r.paidBookedCalls,
        paidAttendedCalls: r.paidAttendedCalls,
        costPerBookedCall: r.paidBookedCalls === 0 ? null : adSpend / r.paidBookedCalls,
        costPerAttendedCall: r.paidAttendedCalls === 0 ? null : adSpend / r.paidAttendedCalls,
      };
    }),
  };
}
