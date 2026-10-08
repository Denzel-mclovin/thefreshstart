// server/utils/analytics/query-helpers.ts
//
// Общее для всех /api/analytics/*: разбор query (from/to/granularity) и
// безопасная подстановка granularity в SQL (никогда из "сырого" пользовательского текста).
//
// Берёт query уже распарсенным (результат h3's getQuery(event)), а не
// URLSearchParams — в Nuxt это объект, не строка.

import { Prisma } from "../../../prisma/generated/client";

export type Granularity = "week" | "month";

export interface RangeParams {
  from: Date;
  to: Date;
  granularity: Granularity;
}

export function parseRange(query: Record<string, unknown>): RangeParams {
  const granularityRaw = (query.granularity as string) ?? "week";
  if (granularityRaw !== "week" && granularityRaw !== "month") {
    throw createError({
      statusCode: 400,
      statusMessage: `granularity must be "week" or "month", got "${granularityRaw}"`,
    });
  }
  const granularity: Granularity = granularityRaw;

  const now = new Date();
  const defaultFrom = new Date(now);
  defaultFrom.setDate(defaultFrom.getDate() - 12 * 7);

  const fromRaw = query.from as string | undefined;
  const toRaw = query.to as string | undefined;

  const from = fromRaw ? new Date(fromRaw) : defaultFrom;
  const to = toRaw ? new Date(toRaw) : now;

  if (Number.isNaN(from.getTime())) {
    throw createError({ statusCode: 400, statusMessage: `invalid "from" date: ${fromRaw}` });
  }
  if (Number.isNaN(to.getTime())) {
    throw createError({ statusCode: 400, statusMessage: `invalid "to" date: ${toRaw}` });
  }
  if (from > to) {
    throw createError({ statusCode: 400, statusMessage: `"from" must be before "to"` });
  }

  return { from, to, granularity };
}

// granularity ограничена типом Granularity (никогда произвольный текст),
// поэтому безопасно подставлять через Prisma.raw в date_trunc()/generate_series().
export function truncUnit(granularity: Granularity): Prisma.Sql {
  return granularity === "week" ? Prisma.raw(`'week'`) : Prisma.raw(`'month'`);
}

export function intervalStep(granularity: Granularity): Prisma.Sql {
  return granularity === "week" ? Prisma.raw(`interval '1 week'`) : Prisma.raw(`interval '1 month'`);
}
