// server/api/analytics/sales.get.ts
//
// GET /api/analytics/sales?from=&to=&granularity=week

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const range = parseRange(query);
  const rows = await getSales(range.from, range.to, range.granularity);
  return { granularity: range.granularity, from: range.from, to: range.to, rows };
});
