// server/api/analytics/ads/cost-per-call.get.ts
//
// GET /api/analytics/ads/cost-per-call?from=&to=&granularity=week
//
// Отдаёт { available: false, reason } пока нет атрибуции — см.
// server/utils/analytics/ads.ts. Фронт должен явно показывать это
// состояние, а не скрытый ноль или протухший кэш.

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const range = parseRange(query);
  return await getCostPerCall(range.from, range.to, range.granularity);
});
