// server/api/analytics/safety/refunds.get.ts
//
// GET /api/analytics/safety/refunds?from=&to=
//
// ТЗ 4.6 — обязательная safety-метрика.

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const range = parseRange(query);
  const rows = await getRefundSafetyMetric(range.from, range.to);
  return { from: range.from, to: range.to, rows };
});
