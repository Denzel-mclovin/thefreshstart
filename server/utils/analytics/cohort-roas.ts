// server/utils/analytics/cohort-roas.ts
//
// ТЗ 4.4. Когорта = лиды, сгруппированные по НЕДЕЛЕ генерации (leadCreatedAt).
// Выручка когорты — только из closes в пределах 90 дней от leadCreatedAt
// конкретного лида, а не выручка, попавшая в тот же календарный период, что и spend.
//
// leadCount всегда в ответе — фронт обязан показывать его рядом с ROAS,
// а не прятать в тултип.

import { prisma } from "../prisma";

export interface CohortRow {
  cohortWeekStart: string;
  leadCount: number;
  adSpend: number;
  closesWithin90d: number;
  contractValueWithin90d: number;
  cashCollectedWithin90d: number;
  bookedCohortROAS: number | null;
  collectedCohortROAS: number | null;
  cohortComplete: boolean;
}

interface RawRow {
  cohortWeek: Date;
  leadCount: number;
  contractCents: number;
  cashCents: number;
  closes: number;
  adSpendCents: number;
}

export async function getCohortRoas(weeks: number): Promise<CohortRow[]> {
  const now = new Date();
  const earliestCohortStart = new Date(now);
  earliestCohortStart.setDate(earliestCohortStart.getDate() - weeks * 7);

  const rows = await prisma.$queryRaw<RawRow[]>`
    WITH cohorts AS (
      SELECT
        date_trunc('week', "leadCreatedAt") AS cohort_week,
        id,
        "leadCreatedAt"
      FROM leads
      WHERE "leadCreatedAt" >= ${earliestCohortStart}
    ),
    cohort_sizes AS (
      SELECT cohort_week, COUNT(*)::int AS lead_count
      FROM cohorts
      GROUP BY 1
    ),
    revenue AS (
      SELECT
        cohorts.cohort_week,
        COUNT(*) FILTER (WHERE l."closedAt" IS NOT NULL AND l."closedAt" <= cohorts."leadCreatedAt" + interval '90 days')::int AS closes,
        COALESCE(SUM(c."contractValue") FILTER (WHERE l."closedAt" IS NOT NULL AND l."closedAt" <= cohorts."leadCreatedAt" + interval '90 days'), 0)::int AS contract_cents,
        COALESCE(SUM(c."cashCollected") FILTER (WHERE l."closedAt" IS NOT NULL AND l."closedAt" <= cohorts."leadCreatedAt" + interval '90 days'), 0)::int AS cash_cents
      FROM cohorts
      JOIN leads l ON l.id = cohorts.id
      LEFT JOIN clients c ON c."leadId" = l.id
      GROUP BY 1
    ),
    spend AS (
      SELECT date_trunc('week', "date") AS cohort_week, SUM("spend")::int AS cents
      FROM ad_insights
      WHERE "date" >= ${earliestCohortStart}
      GROUP BY 1
    )
    SELECT
      cohort_sizes.cohort_week AS "cohortWeek",
      cohort_sizes.lead_count AS "leadCount",
      COALESCE(revenue.contract_cents, 0) AS "contractCents",
      COALESCE(revenue.cash_cents, 0) AS "cashCents",
      COALESCE(revenue.closes, 0) AS closes,
      COALESCE(spend.cents, 0) AS "adSpendCents"
    FROM cohort_sizes
    LEFT JOIN revenue ON revenue.cohort_week = cohort_sizes.cohort_week
    LEFT JOIN spend ON spend.cohort_week = cohort_sizes.cohort_week
    ORDER BY cohort_sizes.cohort_week;
  `;

  return rows.map((r) => {
    const adSpend = r.adSpendCents / 100;
    const contractValueWithin90d = r.contractCents / 100;
    const cashCollectedWithin90d = r.cashCents / 100;
    const windowEnd = new Date(r.cohortWeek);
    windowEnd.setDate(windowEnd.getDate() + 90);

    return {
      cohortWeekStart: r.cohortWeek.toISOString(),
      leadCount: r.leadCount,
      adSpend,
      closesWithin90d: r.closes,
      contractValueWithin90d,
      cashCollectedWithin90d,
      bookedCohortROAS: adSpend === 0 ? null : contractValueWithin90d / adSpend,
      collectedCohortROAS: adSpend === 0 ? null : cashCollectedWithin90d / adSpend,
      cohortComplete: windowEnd <= now,
    };
  });
}
