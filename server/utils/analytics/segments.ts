// server/utils/analytics/segments.ts
//
// ТЗ 4.5. Одна функция для Q4 и Q5 — отличается только questionId.
// Сверить реальные questionId в QuizAnswer с конфигом квиза перед продакшеном.

import { prisma } from "../prisma";

export interface SegmentRow {
  answer: string;
  leadCount: number;
  booked: number;
  attended: number;
  closed: number;
  bookingRate: number | null;
  showRate: number | null;
  closeRate: number | null;
}

interface RawRow {
  answer: string;
  leadCount: number;
  booked: number;
  attended: number;
  closed: number;
}

function safeDiv(n: number, d: number): number | null {
  return d === 0 ? null : n / d;
}

export async function getSegmentBreakdown(questionId: number, from: Date, to: Date): Promise<SegmentRow[]> {
  const rows = await prisma.$queryRaw<RawRow[]>`
    SELECT
      qa.answer AS answer,
      COUNT(DISTINCT l.id)::int AS "leadCount",
      COUNT(DISTINCT l.id) FILTER (WHERE l."bookingMadeAt" IS NOT NULL)::int AS booked,
      COUNT(DISTINCT l.id) FILTER (
        WHERE l."callOutcomeAt" IS NOT NULL
          AND l.status NOT IN ('NO_SHOW', 'CANCELLED', 'RESCHEDULED')
      )::int AS attended,
      COUNT(DISTINCT l.id) FILTER (WHERE l."closedAt" IS NOT NULL)::int AS closed
    FROM answers qa
    JOIN leads l ON l.id = qa."leadId"
    WHERE qa."questionId" = ${questionId}
      AND l."leadCreatedAt" BETWEEN ${from} AND ${to}
    GROUP BY qa.answer
    ORDER BY "leadCount" DESC;
  `;

  return rows.map((r) => ({
    answer: r.answer,
    leadCount: r.leadCount,
    booked: r.booked,
    attended: r.attended,
    closed: r.closed,
    bookingRate: safeDiv(r.booked, r.leadCount),
    showRate: safeDiv(r.attended, r.booked),
    closeRate: safeDiv(r.closed, r.attended),
  }));
}
