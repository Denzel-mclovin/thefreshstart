// server/utils/analytics/funnel.ts
//
// ТЗ 4.2. Четыре отдельные rate (не один "opt-in rate"), плюс CPA по
// quiz-complete / booking / close. Группировка по неделе/месяцу — lifetime
// версии нет намеренно.

import { prisma } from "../prisma";
import { Granularity, truncUnit, intervalStep } from "./query-helpers";

interface RawRow {
  bucket: Date;
  firstVisits: number;
  quizStarts: number;
  leadsCreated: number; // "Q4 completed"
  quizFinishes: number; // "Q5 completed"
  bookings: number;
  closes: number;
  adSpendCents: number;
}

export interface FunnelRow {
  period: string;
  firstVisits: number;
  quizStarts: number;
  leadsCreated: number;
  quizFinishes: number;
  bookings: number;
  closes: number;
  adSpend: number;

  visitToQuizStart: number | null;
  quizStartToLead: number | null;
  leadToQuizFinish: number | null;
  leadToBooking: number | null;

  cpaQuizComplete: number | null;
  cpaBooking: number | null;
  cpaClose: number | null;
}

function safeDiv(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null;
  return numerator / denominator;
}

export async function getFunnel(from: Date, to: Date, granularity: Granularity): Promise<FunnelRow[]> {
  const trunc = truncUnit(granularity);
  const step = intervalStep(granularity);

  const rows = await prisma.$queryRaw<RawRow[]>`
    WITH periods AS (
      SELECT generate_series(date_trunc(${trunc}, ${from}::timestamp), date_trunc(${trunc}, ${to}::timestamp), ${step}) AS bucket
    ),
    visits AS (
      SELECT date_trunc(${trunc}, "firstVisitAt") AS bucket, COUNT(*)::int AS n
      FROM leads WHERE "firstVisitAt" BETWEEN ${from} AND ${to} GROUP BY 1
    ),
    quiz_starts AS (
      SELECT date_trunc(${trunc}, "quizStartedAt") AS bucket, COUNT(*)::int AS n
      FROM leads WHERE "quizStartedAt" BETWEEN ${from} AND ${to} GROUP BY 1
    ),
    lead_created AS (
      SELECT date_trunc(${trunc}, "leadCreatedAt") AS bucket, COUNT(*)::int AS n
      FROM leads WHERE "leadCreatedAt" BETWEEN ${from} AND ${to} GROUP BY 1
    ),
    quiz_finish AS (
      SELECT date_trunc(${trunc}, "quizCompletedAt") AS bucket, COUNT(*)::int AS n
      FROM leads WHERE "quizCompletedAt" BETWEEN ${from} AND ${to} GROUP BY 1
    ),
    bookings AS (
      SELECT date_trunc(${trunc}, "bookingMadeAt") AS bucket, COUNT(*)::int AS n
      FROM leads WHERE "bookingMadeAt" BETWEEN ${from} AND ${to} GROUP BY 1
    ),
    closes AS (
      SELECT date_trunc(${trunc}, "closedAt") AS bucket, COUNT(*)::int AS n
      FROM leads WHERE "closedAt" BETWEEN ${from} AND ${to} GROUP BY 1
    ),
    spend AS (
      SELECT date_trunc(${trunc}, "date") AS bucket, SUM("spend")::int AS cents
      FROM ad_insights WHERE "date" BETWEEN ${from} AND ${to} GROUP BY 1
    )
    SELECT
      periods.bucket AS bucket,
      COALESCE(visits.n, 0) AS "firstVisits",
      COALESCE(quiz_starts.n, 0) AS "quizStarts",
      COALESCE(lead_created.n, 0) AS "leadsCreated",
      COALESCE(quiz_finish.n, 0) AS "quizFinishes",
      COALESCE(bookings.n, 0) AS "bookings",
      COALESCE(closes.n, 0) AS "closes",
      COALESCE(spend.cents, 0) AS "adSpendCents"
    FROM periods
    LEFT JOIN visits ON visits.bucket = periods.bucket
    LEFT JOIN quiz_starts ON quiz_starts.bucket = periods.bucket
    LEFT JOIN lead_created ON lead_created.bucket = periods.bucket
    LEFT JOIN quiz_finish ON quiz_finish.bucket = periods.bucket
    LEFT JOIN bookings ON bookings.bucket = periods.bucket
    LEFT JOIN closes ON closes.bucket = periods.bucket
    LEFT JOIN spend ON spend.bucket = periods.bucket
    ORDER BY periods.bucket;
  `;

  return rows.map((r) => {
    const adSpend = r.adSpendCents / 100;
    return {
      period: r.bucket.toISOString(),
      firstVisits: r.firstVisits,
      quizStarts: r.quizStarts,
      leadsCreated: r.leadsCreated,
      quizFinishes: r.quizFinishes,
      bookings: r.bookings,
      closes: r.closes,
      adSpend,

      visitToQuizStart: safeDiv(r.quizStarts, r.firstVisits),
      quizStartToLead: safeDiv(r.leadsCreated, r.quizStarts),
      leadToQuizFinish: safeDiv(r.quizFinishes, r.leadsCreated),
      leadToBooking: safeDiv(r.bookings, r.leadsCreated),

      cpaQuizComplete: r.leadsCreated === 0 ? null : adSpend / r.leadsCreated,
      cpaBooking: r.bookings === 0 ? null : adSpend / r.bookings,
      cpaClose: r.closes === 0 ? null : adSpend / r.closes,
    };
  });
}
