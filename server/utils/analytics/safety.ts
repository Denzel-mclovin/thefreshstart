// server/utils/analytics/safety.ts
//
// ТЗ 4.6 — обязательная safety-метрика. Split по Lead.financingFlag
// (ближайшее к "Q4 финансовая готовность" существующее поле).
//
// Пробел в схеме: нет отдельного cancelledAt на Client, только refundDate.
// "Отмена" тут приближена через status IN ('CHURNED','REFUNDED'), когда
// refundDate пуст — это более слабый сигнал, чем настоящая дата отмены.

import { prisma } from "../prisma";

export interface SafetyRow {
  financingFlag: boolean;
  totalClosed: number;
  refundedOrCancelledWithin30d: number;
  rate: number | null;
}

interface RawRow {
  financingFlag: boolean;
  totalClosed: number;
  flagged: number;
}

export async function getRefundSafetyMetric(from: Date, to: Date): Promise<SafetyRow[]> {
  const rows = await prisma.$queryRaw<RawRow[]>`
    SELECT
      l."financingFlag" AS "financingFlag",
      COUNT(DISTINCT l.id)::int AS "totalClosed",
      COUNT(DISTINCT l.id) FILTER (
        WHERE (
          (c."refundDate" IS NOT NULL AND c."refundDate" <= l."closedAt" + interval '30 days')
          OR
          (c."refundDate" IS NULL AND c.status IN ('CHURNED', 'REFUNDED'))
        )
      )::int AS flagged
    FROM leads l
    JOIN clients c ON c."leadId" = l.id
    WHERE l."closedAt" BETWEEN ${from} AND ${to}
    GROUP BY l."financingFlag"
    ORDER BY l."financingFlag";
  `;

  return rows.map((r) => ({
    financingFlag: r.financingFlag,
    totalClosed: r.totalClosed,
    refundedOrCancelledWithin30d: r.flagged,
    rate: r.totalClosed === 0 ? null : r.flagged / r.totalClosed,
  }));
}
