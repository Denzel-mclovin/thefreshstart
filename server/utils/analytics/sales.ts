// server/utils/analytics/sales.ts
//
// ТЗ 4.3. bookedROAS = contractValue / adSpend, collectedROAS = cashCollected / adSpend.
//
// Допущение: Client.cashCollected — снэпшот на клиенте, не помесячный леджер
// платежей. С рассрочкой Affirm точный cash collected по периодам требует
// отдельной таблицы платежей для Client (как Payment уже есть для Subscription).

import { prisma } from "../prisma";
import { Granularity, truncUnit, intervalStep } from "./query-helpers";

interface RawRow {
  bucket: Date;
  booked: number;
  attended: number;
  closed: number;
  contractValueCents: number;
  cashCollectedCents: number;
  adSpendCents: number;
}

export interface SalesRow {
  period: string;
  booked: number;
  attended: number;
  closed: number;
  showUpRate: number | null;
  closeRate: number | null;
  contractValueBooked: number;
  cashCollected: number;
  adSpend: number;
  bookedROAS: number | null;
  collectedROAS: number | null;
}

function safeDiv(n: number, d: number): number | null {
  return d === 0 ? null : n / d;
}

export async function getSales(from: Date, to: Date, granularity: Granularity): Promise<SalesRow[]> {
  const trunc = truncUnit(granularity);
  const step = intervalStep(granularity);

  const rows = await prisma.$queryRaw<RawRow[]>`
    WITH periods AS (
      SELECT generate_series(date_trunc(${trunc}, ${from}::timestamp), date_trunc(${trunc}, ${to}::timestamp), ${step}) AS bucket
    ),
    booked AS (
      SELECT date_trunc(${trunc}, "bookingMadeAt") AS bucket, COUNT(*)::int AS n
      FROM leads WHERE "bookingMadeAt" BETWEEN ${from} AND ${to} GROUP BY 1
    ),
    attended AS (
      SELECT date_trunc(${trunc}, "callOutcomeAt") AS bucket, COUNT(*)::int AS n
      FROM leads
      WHERE "callOutcomeAt" BETWEEN ${from} AND ${to}
        AND status NOT IN ('NO_SHOW', 'CANCELLED', 'RESCHEDULED')
      GROUP BY 1
    ),
    closed AS (
      SELECT date_trunc(${trunc}, l."closedAt") AS bucket,
             COUNT(*)::int AS n,
             COALESCE(SUM(c."contractValue"), 0)::int AS contract_cents,
             COALESCE(SUM(c."cashCollected"), 0)::int AS cash_cents
      FROM leads l
      LEFT JOIN clients c ON c."leadId" = l.id
      WHERE l."closedAt" BETWEEN ${from} AND ${to}
      GROUP BY 1
    ),
    spend AS (
      SELECT date_trunc(${trunc}, "date") AS bucket, SUM("spend")::int AS cents
      FROM ad_insights WHERE "date" BETWEEN ${from} AND ${to} GROUP BY 1
    )
    SELECT
      periods.bucket AS bucket,
      COALESCE(booked.n, 0) AS booked,
      COALESCE(attended.n, 0) AS attended,
      COALESCE(closed.n, 0) AS closed,
      COALESCE(closed.contract_cents, 0) AS "contractValueCents",
      COALESCE(closed.cash_cents, 0) AS "cashCollectedCents",
      COALESCE(spend.cents, 0) AS "adSpendCents"
    FROM periods
    LEFT JOIN booked ON booked.bucket = periods.bucket
    LEFT JOIN attended ON attended.bucket = periods.bucket
    LEFT JOIN closed ON closed.bucket = periods.bucket
    LEFT JOIN spend ON spend.bucket = periods.bucket
    ORDER BY periods.bucket;
  `;

  return rows.map((r) => {
    const adSpend = r.adSpendCents / 100;
    const contractValueBooked = r.contractValueCents / 100;
    const cashCollected = r.cashCollectedCents / 100;
    return {
      period: r.bucket.toISOString(),
      booked: r.booked,
      attended: r.attended,
      closed: r.closed,
      showUpRate: safeDiv(r.attended, r.booked),
      closeRate: safeDiv(r.closed, r.attended),
      contractValueBooked,
      cashCollected,
      adSpend,
      bookedROAS: adSpend === 0 ? null : contractValueBooked / adSpend,
      collectedROAS: adSpend === 0 ? null : cashCollected / adSpend,
    };
  });
}
